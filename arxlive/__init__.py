from flask import Flask
from flask_bootstrap import Bootstrap
import os

from arxlive import views


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    Bootstrap(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_object("config")
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.update(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # disable CDN support for security
    app.config['BOOTSTRAP_SERVE_LOCAL'] = True

    # routes
    app.add_url_rule('/', 'deepchange', views.deepchange)
    app.add_url_rule('/deepchange/', 'deepchange', views.deepchange)

    return app
