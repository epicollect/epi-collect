import bcrypt
import sentry_sdk
from sendgrid import Mail, SendGridAPIClient
from sentry_sdk.integrations.flask import FlaskIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

from epi_collect.api.tokens import generate_human_readable_token

sentry_sdk.init(dsn="https://5f0ebb4296f04182a271364dc69c5b9c@sentry.io/5178703",
                integrations=[FlaskIntegration(), SqlalchemyIntegration()])

import datetime
import json
import logging
import os
import shutil
import tarfile
import tempfile
import zipfile
from typing import List

import requests
from flask import Flask, request
from werkzeug.utils import secure_filename

from epi_collect.api.data_classes import LocationDatum, ActivityDatum
from epi_collect.api.db import get_db_connection, Location, Activity, User, UserData
from epi_collect.api.utils import get_aws_secret

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024  # 64MB max per request

# TODO: Clean this file up and split things out

ALLOWED_GOOGLE_TAKEOUT_EXTENSIONS = ['tgz', 'zip', 'json']
UNZIPPABLE_EXTENSIONS = ['tgz', 'zip']
GOOGLE_TAKEOUT_PATH = 'Takeout/Location History/Location History.json'

credentials_source = os.environ.get('CREDENTIALS_SOURCE', 'local')
if credentials_source == 'aws':
    RECAPTCHA_SECRET = get_aws_secret('recaptcha')['secret_key']
    # Note that we can't use a per-user salt, because we're using the hash to identify the user (on purpose).
    BCRYPT_SALT = get_aws_secret('bcrypt')['salt']
    SENDGRID_TRANSACTIONAL_API_KEY = get_aws_secret('sendgrid')['transactional_mail_api_key']
    sendgrid_client = SendGridAPIClient(SENDGRID_TRANSACTIONAL_API_KEY)
    SENDGRID_MAILING_LIST_ID = '9c45a7d2-85fa-4c95-ad39-3f4895529941'
else:
    BCRYPT_SALT = '$2b$12$vTjc1gqoKNnBFOM.w2sb..'  # Obviously different from the production one :)

# Do not include any data before this point, 2 weeks before first probable case according to WHO
EARLIEST_DATETIME = int(
    datetime.datetime(2019, 12, 17, 0, 0, 0).replace(tzinfo=datetime.timezone.utc).timestamp() * 1000)
# Anything with a higher accuracy number (= less accurate) will be removed
MAX_ACCURACY = 5000

if __name__ != '__main__':
    # Assumption here is that if we are not called directly, we're running through
    # gunicorn and hence in prod
    # TODO: clean this up
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


def allowed_file(filename: str, extensions: List[str]):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions


def parse_google_takeout_data(data: dict) -> List[LocationDatum]:
    """
    Parse Google Takeout's JSON format and build list of LocationDatums.
    We limit the data to data after EARLIEST_DATETIME.
    Also do some very rough accuracy filtering.
    """
    output = []
    for item in data['locations']:
        timestamp = int(item['timestampMs'])
        if timestamp < EARLIEST_DATETIME:
            continue
        longitude = item['longitudeE7'] / 10000000.0
        latitude = item['latitudeE7'] / 10000000.0
        accuracy = item['accuracy']
        if accuracy > MAX_ACCURACY:
            continue
        activities = []
        if 'activity' in item:
            for activity in item['activity']:
                activity_timestamp = int(activity['timestampMs'])
                assert len(activity['activity'])
                highest_confidence_activity = max(activity['activity'], key=lambda x: x['confidence'])
                activities.append(
                    ActivityDatum(timestamp=activity_timestamp, activity=highest_confidence_activity['type'],
                                  confidence=highest_confidence_activity['confidence']))
        output.append(LocationDatum(
            timestamp=timestamp,
            longitude=longitude,
            latitude=latitude,
            accuracy=accuracy,
            activities=activities
        ))
    return output


def parse_google_takeout_archive(filepath: str) -> List[LocationDatum]:
    _, extension = os.path.splitext(filepath)
    extension = extension[1:]  # Remove the .
    if extension in UNZIPPABLE_EXTENSIONS:
        # Extract from archive first
        if extension == 'tgz':
            with tarfile.open(filepath, 'r') as t:
                with t.extractfile(GOOGLE_TAKEOUT_PATH) as f:
                    data = json.load(f)
        else:
            with zipfile.ZipFile(filepath) as t:
                with t.open(GOOGLE_TAKEOUT_PATH, 'r') as f:
                    data = json.load(f)
    else:
        with open(filepath, 'r') as f:
            data = json.load(f)

    return parse_google_takeout_data(data)


@app.route('/api/extract/google-takeout', methods=['POST'])
def extract_google_takeout():
    if 'file' not in request.files:
        return {'error': 'file not present'}, 400
    file = request.files['file']
    if not file.filename:
        return {'error': 'empty filename'}, 400
    if file and allowed_file(file.filename, ALLOWED_GOOGLE_TAKEOUT_EXTENSIONS):
        # Save to a temporary directory, that we remove after parsing
        tmpdir = tempfile.mkdtemp()
        try:
            filename = secure_filename(file.filename)
            full_path = os.path.join(tmpdir, filename)
            file.save(full_path)
            try:
                return {
                           'data': list(map(lambda x: x.to_dict(), parse_google_takeout_archive(full_path)))
                       }, 200
            except Exception as e:
                logging.error(e)
                return {'error': f'Could not parse archive'}, 400
        finally:
            shutil.rmtree(tmpdir)


def flatten_dict(data: dict, prefix: str = '') -> dict:
    flattened = {}
    for k, v in data.items():
        key = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            flattened.update(flatten_dict(v, prefix=key))
        else:
            flattened[key] = v
    return flattened


def fill_missing_user_data_values(data: dict) -> dict:
    if data['has_symptoms'] == '0':
        # No symptoms
        for k in data['symptoms'].keys():
            data['symptoms'][k] = '0'
    if data['has_preexisting_conditions'] == '0':
        # No pre-existing conditions
        for k in data['preexisting_conditions'].keys():
            data['preexisting_conditions'][k] = '0'
    return data


def check_recaptcha(captcha_token: str) -> bool:
    # Locally, skip captcha verification
    if credentials_source == 'local':
        return True
    # Verify captcha
    captcha_res = requests.post('https://www.google.com/recaptcha/api/siteverify',
                                {'secret': RECAPTCHA_SECRET, 'response': captcha_token})
    captcha_res_json = captcha_res.json()
    return not ('success' not in captcha_res_json or captcha_res_json['success'] == False)


@app.route('/api/save', methods=['POST'])
def save():
    try:
        # Process data
        data = request.json

        if not check_recaptcha(data['captcha_token']):
            return {'error': f'Could not save data; captcha token invalid'}, 400
        else:
            logging.info('Captcha verified')

        # Extract user-provided data
        locations = [LocationDatum(**l) for l in data['locations']]
        user_data_dict = fill_missing_user_data_values(data['user_data'])
        user_data_dict = flatten_dict(user_data_dict)
        user_data_dict = {k: v for k, v in user_data_dict.items() if v}
        # Save data
        session = get_db_connection()
        try:
            # Keep generating a token until we do not have a collision (this probability is tiny, but just in case)
            non_colliding_token = False
            while not non_colliding_token:
                # Generate user token
                human_readable_token = generate_human_readable_token()
                hashed_token = bcrypt.hashpw(human_readable_token.encode('utf-8'), BCRYPT_SALT.encode('utf-8'))
                non_colliding_token = session.query(User.id).filter_by(token_hash=hashed_token).scalar() is None

            # Add user
            now = datetime.datetime.now(tz=datetime.timezone.utc)
            user = User(token_hash=hashed_token,
                        first_submission_timestamp=now,
                        last_updated_timestamp=now)
            session.add(user)
            session.flush()  # Populate ID

            # Add locations
            orm_locations = [Location.from_location_datum(l, user.id) for l in locations]
            user.locations.extend(orm_locations)
            session.flush()  # Populates the IDs

            # Add user data
            for k, v in user_data_dict.items():
                user.data.append(UserData(
                    user_id=user.id,
                    datum_type=k,
                    datum_value=v,
                    submitted_timestamp=now
                ))

            # Add activities
            for location, orm_location in zip(locations, orm_locations):
                # Add activities
                for activity in location.activities:
                    orm_location.activities.append(
                        Activity.from_activity_datum(activity, orm_location.id))

            session.commit()
            return {'status': 'successful', 'token': human_readable_token}, 200
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    except Exception as e:
        logging.error(e)
        return {'error': f'Could not save data'}, 400


@app.route('/api/delete', methods=['POST'])
def delete():
    try:
        # Process data
        data = request.form

        if not check_recaptcha(data['captcha_token']):
            return {'error': f'Could not remove data; captcha token invalid'}, 400
        else:
            logging.info('Captcha verified')

        session = get_db_connection()
        try:

            # Get user ID corresponding to token
            hashed_token = bcrypt.hashpw(data['token'].encode('utf-8'), BCRYPT_SALT.encode('utf-8'))
            user_id = session.query(User.id).filter_by(token_hash=hashed_token).scalar()
            if user_id is None:
                return {'error': f'Could not remove data; user-provided token invalid'}, 400

            user = session.query(User).filter_by(id=user_id).first()
            session.delete(user)
            session.commit()
            return {'status': 'successful'}, 200
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    except Exception as e:
        logging.error(e)
        return {'error': f'Could not delete data'}, 400


def create_email(to: str, token: str) -> Mail:
    return Mail(
        from_email='noreply@epi-collect.org',
        to_emails=to,
        subject='Your Epi-Collect deletion token',
        html_content=f"""
          <html>
            <head>
              <title></title>
            </head>
            <body>
              <div style="font-size:12px; line-height:20px; text-align:left;">
                <p>Hi,</p>
                <p>Thank you so much for donating your data to Epi-Collect and thereby helping us to build an open source contact tracing dataset.</p>
                <p>We want you to be in full control of your data. As your data is anonymous and not linked to your e-mail address, please make sure you do not loose the following token:</p>
                <pre>{token}</pre>
                <p>If you ever want to delete your data, please enter this token on <a href="https://www.epi-collect.org/delete">https://www.epi-collect.org/delete</a>. Without this token, we will not be able to identify which data is yours and hence we will not be able to delete your data.</p>
                <p>If you chose to sign up for our mailing list, you will receive a separate e-mail about that.</p>
                <p>Thank you,</p>
                <p>Epi-Collect</p>
              </div>
            </body>
          </html>""")


@app.route('/api/insert-email', methods=['POST'])
def insert_email():
    try:
        # Process data
        data = request.form

        if not check_recaptcha(data['captcha_token']):
            return {'error': f'Could not remove data; captcha token invalid'}, 400
        else:
            logging.info('Captcha verified')

        session = get_db_connection()
        try:

            # Check that the token the user provided is actually valid
            hashed_token = bcrypt.hashpw(data['token'].encode('utf-8'), BCRYPT_SALT.encode('utf-8'))
            user_id = session.query(User.id).filter_by(token_hash=hashed_token).scalar()
            if user_id is None:
                return {'error': f'Could not remove data; user-provided token invalid'}, 400

            # Don't send emails in dev environment
            if credentials_source != 'local':
                # Send token email
                sendgrid_client.send(create_email(data['email'], data['token']))

                # If user wants to sign up for mailing list, add them
                if data['add_to_mailing_list'] == 'true':
                    sendgrid_client.client.marketing.contacts.put(
                        request_body=dict(
                            list_ids=[SENDGRID_MAILING_LIST_ID],
                            contacts=[{'email': data['email']}]
                        )
                    )
            return {'status': 'successful'}, 200
        except Exception as e:
            raise e
        finally:
            session.close()
    except Exception as e:
        logging.error(e)
        return {'error': f'Could not delete data'}, 400


@app.route('/api/health')
def health():
    return "Healthy"
