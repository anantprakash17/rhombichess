from flask import jsonify, request
from flask_socketio import SocketIO, join_room
from app import app, socketio
from app.chess_board.board import ChessBoard
import uuid

games: dict[str, ChessBoard] = {}

games["123456"] = ChessBoard()

messages: dict[str, list] = {}


def create_game(game_id):
    games[game_id] = ChessBoard()
    messages[game_id] = []


@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({"message": "Hello World!"})


@app.route("/api/new_game", methods=["POST"])
def new_game():
    game_id = str(uuid.uuid4())[:4].upper()
    create_game(game_id)
    return jsonify({"game_id": game_id})


@app.route("/api/game/<game_id>", methods=["GET", "POST"])
def game(game_id):
    if game_id not in games:
        return jsonify({"message": "Game not found"}), 404
    if request.method == "GET":
        return jsonify({"board": games[game_id].get_piece_locations()})
    elif request.method == "POST":
        data = request.get_json()
        if "old_pos" not in data or "new_pos" not in data:
            return jsonify({"message": "Invalid request"})
        old_pos = int(data["old_pos"].split(",")[0]), int(data["old_pos"].split(",")[1])
        new_pos = int(data["new_pos"].split(",")[0]), int(data["new_pos"].split(",")[1])
        games[game_id].move_piece(old_pos, new_pos)
        return jsonify({"board": games[game_id].get_piece_locations()})
    else:
        return jsonify({"message": "Invalid method"})


@socketio.on("join_room")
def handle_join_room(data):
    room = data.get("room")
    name = data.get("name")
    join_room(room)

    system_message = f"{name} has joined the game."
    messages[room].append(system_message)
    socketio.emit("receive_message", messages[room], to=room)


@socketio.on("send_message")
def handle_send_message(data):
    room = data.get("room")
    messages[room].append(data.get("message"))
    socketio.emit("receive_message", messages[room], to=room)


@socketio.on("send_move")
def handle_send_move(data):
    room = data.get("room")
    socketio.emit(
        "receive_move", games[str(data.get("game_id"))].get_piece_locations(), to=room
    )
