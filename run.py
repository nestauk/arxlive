import os

import arxlive

config = os.environ.get('CONFIG_MODE')
app = arxlive.create_app(config or 'default')

if __name__ == '__main__':
    app.run()
