from flask import Flask, render_template
from flask_s3 import FlaskS3


app = Flask(__name__)
app.config['FLASKS3_BUCKET_NAME'] = 'arxlive-static-react'
s3 = FlaskS3(app)


@app.route('/')
def hello():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
