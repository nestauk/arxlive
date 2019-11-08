#!/bin/bash

cd arxlive-search
yarn build
cp build/static/js/*.js ../arxlive/static/arxlive-search.js
cd ..
. venv/bin/activate
echo Uploading static files to S3
python static_to_s3.py
zappa update dev
