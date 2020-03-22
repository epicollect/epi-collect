from datetime import datetime, timezone
from typing import Union, Optional, List


class ActivityDatum:

    def __init__(self, timestamp: Union[datetime, int], activity: str, confidence: int):
        self.timestamp = datetime.fromtimestamp(int(timestamp) / 1000) if isinstance(timestamp,
                                                                                     int) else timestamp
        self.activity = activity
        self.confidence = confidence

    def to_dict(self) -> dict:
        return {
            'timestamp': int(self.timestamp.replace(tzinfo=timezone.utc).timestamp() * 1000),
            'activity': self.activity,
            'confidence': self.confidence
        }


class LocationDatum:

    def __init__(self, timestamp: Union[datetime, int], longitude: float, latitude: float, accuracy: int,
                 activities: Optional[List[ActivityDatum]] = None):
        self.timestamp = datetime.fromtimestamp(int(timestamp) / 1000) if isinstance(timestamp,
                                                                                     int) else timestamp
        self.longitude = longitude
        self.latitude = latitude
        self.accuracy = accuracy
        self.activities = [a if isinstance(a, ActivityDatum) else ActivityDatum(**a) for a in
                           activities] if activities else []

    def to_dict(self) -> dict:
        return {
            'timestamp': int(self.timestamp.replace(tzinfo=timezone.utc).timestamp() * 1000),
            'longitude': self.longitude,
            'latitude': self.latitude,
            'accuracy': self.accuracy,
            'activities': list(map(lambda x: x.to_dict(), self.activities))
        }
