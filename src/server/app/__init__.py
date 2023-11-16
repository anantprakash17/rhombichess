#we do a little importing
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO



app = Flask(__name__)
app.config['SECRET_KEY'] = 'passwordlol'

#initialize SocketIO
socketio = SocketIO(app)

#initialize CORS
CORS(app)

#Import API routes
from .api import api_blueprint
app.register_blueprint(api_blueprint, url_prefix='/api')


#Import Websocket event handlers
from .websocket import events




