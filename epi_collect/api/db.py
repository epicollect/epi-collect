import argparse
import base64
import json
import os

import boto3
from botocore.exceptions import ClientError
from geoalchemy2 import Geography
from sqlalchemy import create_engine, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from epi_collect.api.data_classes import LocationDatum, ActivityDatum

Base = declarative_base()
Session = sessionmaker()


class Location(Base):
    __tablename__ = 'locations'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    point = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    accuracy = Column(Integer)

    @classmethod
    def from_location_datum(cls, loc: LocationDatum, user_id: int):
        return cls(user_id=user_id, timestamp=loc.timestamp, point=f'POINT({loc.longitude} {loc.latitude})',
                   accuracy=loc.accuracy)


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_submission_timestamp = Column(DateTime, nullable=False)
    last_updated_timestamp = Column(DateTime, nullable=False)


class Symptom(Base):
    __tablename__ = 'symptoms'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    type = Column(String, nullable=True, index=True)
    start_timestamp = Column(DateTime, nullable=True, index=True)
    end_timestamp = Column(DateTime, nullable=True, index=True)


class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True, autoincrement=True)
    location_id = Column(Integer, ForeignKey('locations.id'), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    type = Column(String, nullable=True, index=True)
    confidence = Column(Integer, nullable=True)

    @classmethod
    def from_activity_datum(cls, activity: ActivityDatum, location_id: int):
        return cls(location_id=location_id,
                   timestamp=activity.timestamp,
                   type=activity.activity,
                   confidence=activity.confidence)


def get_db_credentials_aws():
    secret_name = "dbcredentials"
    region_name = "us-east-2"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = json.loads(get_secret_value_response['SecretString'])
        else:
            secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return secret['username'], secret['password'], secret['host'], secret['port'], 'epicollect'


def get_db_credentials_local():
    return 'postgres', 'postgres', 'localhost', 5432, 'postgres'


def get_db_engine(*args, **kwargs):
    credentials_source = os.environ.get('CREDENTIALS_SOURCE', 'local')
    if credentials_source == 'aws':
        user, password, endpoint, port, database = get_db_credentials_aws()
    else:
        user, password, endpoint, port, database = get_db_credentials_local()
    return create_engine(f'postgresql://{user}:{password}@{endpoint}:{port}/{database}', *args, **kwargs)


def get_db_connection() -> Session:
    engine = get_db_engine()
    Session.configure(bind=engine)
    return Session()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--create', action='store_true')
    args = parser.parse_args()
    if args.create:
        # Create all tables
        Base.metadata.create_all(get_db_engine())
    else:

        # Dump the CREATE script
        def metadata_dump(sql):
            print(sql)


        Base.metadata.create_all(get_db_engine(strategy='mock', executor=metadata_dump))
