from flask import Flask, request
from flask_cors import CORS
from app import app, socketio

CORS(app)

if __name__ == '__main__':
    socketio.run(app, port=8080)