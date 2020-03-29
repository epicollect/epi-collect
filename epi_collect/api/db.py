import argparse
import os

from geoalchemy2 import Geography
from sqlalchemy import create_engine, Column, DateTime, ForeignKey, Integer, String, Binary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

from epi_collect.api.data_classes import LocationDatum, ActivityDatum
from epi_collect.api.utils import get_aws_secret

Base = declarative_base()
Session = sessionmaker()


class UserData(Base):
    __tablename__ = 'user_data'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    datum_type = Column(String, nullable=False, index=True)
    datum_value = Column(String, nullable=False, index=True)
    submitted_timestamp = Column(DateTime, nullable=True, index=True)


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


class Location(Base):
    __tablename__ = 'locations'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    point = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    accuracy = Column(Integer)
    activities = relationship(Activity, backref='locations', cascade="all,delete")

    @classmethod
    def from_location_datum(cls, loc: LocationDatum, user_id: int):
        return cls(user_id=user_id, timestamp=loc.timestamp, point=f'POINT({loc.longitude} {loc.latitude})',
                   accuracy=loc.accuracy)


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    token_hash = Column(Binary, nullable=False, index=True)
    first_submission_timestamp = Column(DateTime, nullable=False)
    last_updated_timestamp = Column(DateTime, nullable=False)
    data = relationship(UserData, backref='users', cascade="all,delete")
    locations = relationship(Location, backref='users', cascade="all,delete")


def get_db_credentials_aws():
    secret_name = "db-secrets-epi-collect"
    secret = get_aws_secret(secret_name)

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


engine = get_db_engine()


def get_db_connection() -> Session:
    Session.configure(bind=engine)
    return Session()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--create', action='store_true')
    args = parser.parse_args()
    if args.create:
        # Create all tables
        Base.metadata.create_all(engine)
    else:

        # Dump the CREATE script
        def metadata_dump(sql):
            print(sql)


        Base.metadata.create_all(get_db_engine(strategy='mock', executor=metadata_dump))
