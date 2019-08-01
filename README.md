# arxlive
arXlive front end using Flask, Zappa and AWS Lambda

to deploy:
1. create and activate a virtual environment (conda venvs don't seem to work. `venv` is a good name as it will be ignored by git. it cannot be called `arxlive`)
1. install requirements: `pip install -r requirements.txt`
1. create an instance config in `instance/config.py` with `FLASKS3_BUCKET_NAME = 'name
   of the static files bucket'`
1. build hierarxy, push static files to S3 and deploy to AWS Lambda with: `. deploy.sh`
