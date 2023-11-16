from flask import Blueprint

api_blueprint = Blueprint('test_api', __name__)

from . import routes
