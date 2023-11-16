from .. import socketio


@socketio.on('connect')
def handle_connect():
	print("Client connected!")


@socketio.on('disconnect')
def handle_disconnect():
	print("Client disconnected")


@socketio.on('new_message')
def 

@socketio.on('test_event')
def test_event():
	print("test event has activated")
	#return a random response to update all clients listening on the websocket
	emit('response', {'json_time' : 'its go time'})
