from .. import socketio


@socketio.on('connect')
def handle_connect():
	print("Client connected!")


@socketio.on('disconnect')
def handle_disconnect():
	print("Client disconnected")


@socketio.on('test_event')
def test_event():
	print("test event has activated")
	#return a random response
	emit('response', {'json_time' : 'its go time'})
