from flask import Flask

from app.routes.api import api_bp


def create_app():
    app = Flask(__name__)

    # Mantiene i campi nell'ordine in cui sono scritti
    app.json.sort_keys = False

    app.register_blueprint(api_bp, url_prefix="/api")

    return app
