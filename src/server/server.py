from app import app, socketio, join_room

@socketio.on('join_room')
def handle_join_room(data):
    join_room(data)

@socketio.on('send_message')
def handle_send_message(data):
    room = data.get('room')

if __name__ == '__main__':
    socketio.run(app, port=3001)
