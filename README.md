# arxlive
arXlive front end using Flask, Zappa and AWS Lambda

to deploy:
1. create and activate a virtual environment (conda venvs don't seem to work. `venv` is a good name as it will be ignored by git. it cannot be called `arxlive`)
1. install requirements: `pip install -r requirements.txt`
1. deploy to AWS Lambda: `zappa update dev`
