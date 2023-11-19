from app import app
from flask import Flask, request
from flask_socketio import SocketIO, join_room
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

@socketio.on('connection')
def handle_connection():

@socketio.on('join_room')
def handle_join_room(data):
    join_room(data)

@socketio.on('send_message')
def handle_send_message(data):
    room = data.get('room')

if __name__ == '__main__':
    socketio.run(app, port=3001)
