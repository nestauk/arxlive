from config import config
from flask import Flask
from flask_bootstrap import Bootstrap
from flask_s3 import FlaskS3
import os

from arxlive import views

bootstrap = Bootstrap()
s3 = FlaskS3()


def create_app(config_name='default'):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config[config_name])
    app.config.from_pyfile("config.py", silent=True)  # instance config
    
    bootstrap.init_app(app)
    s3.init_app(app)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # routes
    app.add_url_rule('/', 'index', views.index)
    app.add_url_rule('/deepchange/', 'deepchange', views.deepchange)
    app.add_url_rule('/hierarxy/', 'hierarxy', views.hierarxy)
    app.add_url_rule('/keywords/', 'keywords', views.keywords, methods=['GET','POST'])
    app.add_url_rule('/faq/', 'faq', views.faq)

    # error pages
    app.register_error_handler(404, views.page_not_found)
    app.register_error_handler(500, views.internal_server_error)


    
    return app
