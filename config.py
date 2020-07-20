class Config:
    # ensure css files have the correct metadata
    headers = {r'.css$': {'Content-Type':
                          'text/css'},
               r".otf$": {'Content-Type':
                          'text/x-font-opentype',
                          'Access-Control-Allow-Origin': '*'}}
    FLASKS3_FILEPATH_HEADERS = headers
    ES_ENDPOINT = ("https://search-arxlive-t2brq66muzxag44zwmrcfrlmq4."
                   "eu-west-2.es.amazonaws.com/arxiv_v6/_search")
    SECRET_KEY = '7d441f27d441f27567d441f2b6176a'
    FLASK_ASSETS_USE_S3 = True


class DevelopmentConfig(Config):
    DEBUG = True
    # still serve from remote in debug mode
    FLASKS3_DEBUG = True


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    # disable CDN support for security
    BOOTSTRAP_SERVE_LOCAL = True
    DEBUG = False
    TESTING = False


config = {'development': DevelopmentConfig,
          'testing': TestingConfig,
          'production': ProductionConfig,
          'default': DevelopmentConfig}
