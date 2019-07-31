# ensure css files have the correct metadata
FLASKS3_FILEPATH_HEADERS = {r'.css$': {'Content-Type': 'text/css', }}

# serve from remote in debug mode (doesn't seem to have an effect)
FLASKS3_DEBUG = True

# disable CDN support for security
BOOTSTRAP_SERVE_LOCAL = True
