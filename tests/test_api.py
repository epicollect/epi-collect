import io
import json
import os

import pytest

from epi_collect.api import api


@pytest.fixture
def client():
    api.app.config['TESTING'] = True

    with api.app.test_client() as client:
        yield client


def test_extract_google_takeout(client):
    FILES_TO_TEST = ['sample_location_history.json', 'sample_location_history.tgz',
                     'sample_location_history.zip']

    for filename in FILES_TO_TEST:
        filepath = os.path.join('tests/data', filename)

        with open(filepath, 'rb') as f:
            file_data = f.read()

        rv = client.post('/api/extract/google-takeout', data=dict(
            file=(io.BytesIO(file_data), filename)
        ), follow_redirects=True, content_type='multipart/form-data')
        response = json.loads(rv.data)

        assert 'error' not in response
        assert len(response['data']) == 21
        first_loc = response['data'][0]
        assert first_loc['accuracy'] == 49
        assert first_loc['latitude'] == 50.8542525
        assert first_loc['longitude'] == 5.6990650
        assert first_loc['timestamp'] == 1584747305000
