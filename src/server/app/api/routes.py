from flask import jsonify
from app import app

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Hello World!"
    })

@app.route('/')
def test():
	return '<h1>Hello World lol</h1>'
