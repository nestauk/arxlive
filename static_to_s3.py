import flask_s3
from arxlive import create_app

app = create_app()
flask_s3.create_all(app)
