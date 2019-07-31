from flask import Flask
from flask_bootstrap import Bootstrap
from flask_s3 import FlaskS3
import os

from arxlive import views

bootstrap = Bootstrap()
s3 = FlaskS3()


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    bootstrap.init_app(app)
    s3.init_app(app)

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


    # routes
    app.add_url_rule('/', 'deepchange', views.deepchange)
    app.add_url_rule('/deepchange/', 'deepchange', views.deepchange)
    app.add_url_rule('/hierarxy/', 'hierarxy', views.hierarxy)
    app.register_error_handler(404, views.page_not_found)
    app.register_error_handler(500, views.internal_server_error)

    return app
