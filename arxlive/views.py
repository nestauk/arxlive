from flask import render_template


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
