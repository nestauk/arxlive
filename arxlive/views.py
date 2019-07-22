from datetime import datetime
from flask import render_template, current_app


def hello():
    now = datetime.now()
    bucket = current_app.config['CONTENT_BUCKET']
    return render_template('hello.html', now=now, bucket=bucket)
