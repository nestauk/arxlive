from flask import render_template, flash, request, redirect, url_for
from wtforms import Form, TextField, validators
from .keyword_factory import make_query


class KeywordForm(Form):
    name = TextField('Name:', validators=[validators.required()])


def keywords(query=''):
    query = query.lower()
    form = KeywordForm(request.form)
    if request.method == 'POST':
        query = request.form['name']
        return redirect(url_for('keywords', query=query))

    if len(query.strip()) > 0:
        results = make_query(query, size=25,
                             search_field='textBody_abstract_article',
                             return_field='terms_tokens_article')
        for i, _ in enumerate(results):
            if i != len(results) - 1:
                results[i] += ',&nbsp&nbsp&nbsp'
            if i > 0 and i % 5 == 0:
                results[i] += '</br>'
        flash(''.join(results))
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
