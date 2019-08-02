class Config:
    # ensure css files have the correct metadata
    FLASKS3_FILEPATH_HEADERS = {r'.css$': {'Content-Type': 'text/css', }}


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
