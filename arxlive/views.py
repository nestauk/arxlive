from flask import render_template, flash, request, redirect, url_for
import requests
import json
from wtforms import Form, TextField, validators

URL = ("https://search-arxlive-"
       "t2brq66muzxag44zwmrcfrlmq4."
       "eu-west-2.es.amazonaws.com/"
       "arxiv_v1/_search")


def make_query(url, q, alg, field, shard_size=1000, size=15):
    agg_name = 'my_sample'
    query = {"query": {"match": {field: q}},
             "size": 0,
             "aggregations": {
                 agg_name: {
                     "sampler": {"shard_size": shard_size},
                     "aggregations": {
                        "keywords": {
                            "significant_text": {
                                "size": size,
                                "field": field,
                                alg: {}
                            }
                        }
                     }
                 }
             }}
    r = requests.post(url, data=json.dumps(query),
                      headers={'Content-Type': 'application/json'})
    aggs = r.json()['aggregations']
    buckets = aggs[agg_name]['keywords']['buckets']
    return [row['key'] for row in buckets]


class KeywordForm(Form):
    name = TextField('Name:', validators=[validators.required()])


STOPWORDS = make_query(url=URL, q='and of but on by', alg='jlh',
                       field='textBody_abstract_article', size=100)


def keywords(query=''):
    form = KeywordForm(request.form)
    if request.method == 'POST':
        query = request.form['name']
        return redirect(url_for('keywords', query=query))

    if len(query.strip()) > 0:
        results = make_query(url=URL, q=query, alg='jlh',
                             field='textBody_abstract_article')
        results = [r for r in results
                   if r.replace("'", "")[:-1] not in results
                   and r not in STOPWORDS  # basic plurals
                   and r not in query.split()]
        flash(', '.join(results))
    return render_template('keywords.html',
                           query=query,
                           form=form)


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
