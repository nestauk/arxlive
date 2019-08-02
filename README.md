# arxlive
arXlive front end using Flask, Zappa and AWS Lambda

To deploy:
1. `yarn` from inside the `arxlive-search` directory to install javascript modules
1. create and activate a virtual environment (conda venvs don't seem to work. `venv` is a good name as it will be ignored by git. It cannot be called `arxlive`)
1. install requirements: `pip install -r requirements.txt`
1. create an instance config in `instance/config.py` with `FLASKS3_BUCKET_NAME = 'name
   of the static files bucket'`
1. build hierarxy, push static files to S3 and deploy to AWS Lambda with: `. deploy.sh`

To run locally in development mode:
- `python run.py` in the root folder

- set `export CONFIG_MODE=production` to run in production mode with this method

Alternatively:
- set `export FLASK_APP=arxlive`
- set `export FLASK_DEBUG=true`
- `flask run`

- set `export FLASK_DEBUG=false` to run in production mode with this method
