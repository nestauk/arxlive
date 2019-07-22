from datetime import datetime
from flask import Flask


app = Flask(__name__)


@app.route('/')
def hello():
    return f"Hello World! I am arXlive @ {datetime.now()}"


if __name__ == '__main__':
    app.run()
