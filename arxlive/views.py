from flask import render_template


def deepchange():
    return render_template('deepchange.html')


def hierarxy():
    return render_template('arxlive-search.html')


def page_not_found(e):
    return render_template('404.html'), 404


def internal_server_error(e):
    return render_template('500.html'), 500
