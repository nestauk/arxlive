from flask import current_app
import pytest

from arxlive import create_app


@pytest.fixture
def client():
    app = create_app('testing')
    app_context = app.app_context()
    app_context.push()
    yield app.test_client()
    app_context.pop()


class TestConfig:
    def test_app_exists(self, client):
        assert current_app is not None

    def test_in_testing_config(self, client):
        assert current_app.config['TESTING']

    def test_bucket_name_in_config(self, client):
        # should be added in instance/config.py
        assert current_app.config['FLASKS3_BUCKET_NAME']


class TestPages:
    def test_index(self, client):
        response = client.get('/')
        assert response.status_code == 200

    def test_deepchange(self, client):
        response = client.get('/deepchange/')
        assert response.status_code == 200

    def test_hierarxy(self, client):
        response = client.get('/hierarxy/')
        assert response.status_code == 200

    def test_faq(self, client):
        response = client.get('/faq/')
        assert response.status_code == 200
