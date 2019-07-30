from datetime import datetime
from flask import render_template, current_app


def deepchange():
    now = datetime.now()
    bucket = current_app.config['CONTENT_BUCKET']
    return render_template('deepchange.html', now=now, bucket=bucket)


def hierarxy():
    return render_template('arxlive-search.html')
