import datetime
import json
import os
import shutil
import tarfile
import tempfile
import zipfile
from typing import List, Optional

from flask import Flask, request
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024  # 64MB max per request

ALLOWED_GOOGLE_TAKEOUT_EXTENSIONS = ['tgz', 'zip', 'json']
UNZIPPABLE_EXTENSIONS = ['tgz', 'zip']
GOOGLE_TAKEOUT_PATH = 'Takeout/Location History/Location History.json'

# Do not include any data before this point, 2 weeks before first probable case according to WHO
EARLIEST_DATETIME = datetime.datetime(2019, 12, 17, 0, 0, 0)
# Anything with a higher accuracy number (= less accurate) will be removed
MAX_ACCURACY = 5000


class ActivityDatum:

    def __init__(self, timestamp: datetime.datetime, activity: str, confidence: int):
        self.timestamp = timestamp
        self.activity = activity
        self.confidence = confidence

    def to_dict(self) -> dict:
        return {
            'timestamp': int(self.timestamp.replace(tzinfo=datetime.timezone.utc).timestamp() * 1000),
            'activity': self.activity,
            'confidence': self.confidence
        }


class LocationDatum:

    def __init__(self, timestamp: datetime.datetime, longitude: float, latitude: float, accuracy: int,
                 activities: Optional[List[ActivityDatum]] = None):
        self.timestamp = timestamp
        self.longitude = longitude
        self.latitude = latitude
        self.accuracy = accuracy
        self.activities = activities if activities else []

    def to_dict(self) -> dict:
        return {
            'timestamp': int(self.timestamp.replace(tzinfo=datetime.timezone.utc).timestamp() * 1000),
            'longitude': self.longitude,
            'latitude': self.latitude,
            'accuracy': self.accuracy,
            'activities': list(map(lambda x: x.to_dict(), self.activities))
        }


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
        timestamp = datetime.datetime.fromtimestamp(int(item['timestampMs']) / 1000)
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
                activity_timestamp = datetime.datetime.fromtimestamp(int(activity['timestampMs']) / 1000)
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


@app.route('/extract/google-takeout', methods=['POST'])
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
                return {'error': f'Could not parse archive: {str(e)}'}, 400
        finally:
            shutil.rmtree(tmpdir)
