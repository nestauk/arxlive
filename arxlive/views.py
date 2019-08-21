from flask import Flask, render_template, flash, request
import requests
import json
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField

URL = "https://search-arxlive-t2brq66muzxag44zwmrcfrlmq4.eu-west-2.es.amazonaws.com/arxiv_v1/_search"

def make_query(url, q, alg, field, shard_size=1000, size=20):
    query = {"query" : { "match" : {field : q } },
             "size": 0,
             "aggregations" : {
                 "my_sample" : {
                     "sampler" : {"shard_size" : shard_size},
                     "aggregations": {
                        "keywords" : {
                            "significant_text" : {
                                "size": size,
                                "field" : field,
                                alg:{}
                             }
                        }
                    }
                }
            }
        }
    return [row['key'] for row in requests.post(url, data=json.dumps(query),
                                                headers={'Content-Type':'application/json'}).json()['aggregations']['my_sample']['keywords']['buckets']]


class KeywordForm(Form):
    name = TextField('Name:', validators=[validators.required()])
    default_methods = ['GET', 'POST']


def keywords():
    form = KeywordForm(request.form)
    if request.method == 'POST':
        text = request.form['name']
        if len(text.strip()) > 0:
            results = make_query(url=URL, q=text, alg='jlh',
                                 field='textBody_abstract_article')
            results = [r for r in results
                       if r.replace("'", "")[:-1] not in results]  # remove basic plurals
            flash(', '.join(results))
    return render_template('keywords.html', form=form)


def index():
    return render_template('index.html')


def deepchange():
    return render_template('deepchange.html')


def faq():
    return render_template('faq.html')


def hierarxy():
    return render_template('arxlive-search.html')


def page_not_found(e):
    return render_template('404.html'), 404


def internal_server_error(e):
    return render_template('500.html'), 500
