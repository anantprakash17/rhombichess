import json
import uuid

from app import app, socketio
from app.chess_board.board import ChessBoard
from flask import jsonify, request
from flask_socketio import SocketIO, join_room

games: dict[str, dict] = {}

messages: dict[str, list] = {}


def generate_valid_moves(game_id):
    valid_moves = {}
    return {str(k): v for k, v in games[game_id]["board"].valid_moves.items() if v != []}


def create_game(game_id, password, user, color):
    opposite_color = "white" if color == "black" else "black"

    games[game_id] = {
        "password": password,
        "board": ChessBoard(),
        "player_1": {"id": user["id"], "name": user["name"], "color": color},
        "player_2": {"id": None, "name": None, "color": opposite_color},
    }
    messages[game_id] = []


@app.route("/api/new_game", methods=["POST"])
def new_game():
    data = request.get_json()
    password = data["password"]
    color = data["color"]
    user = data["user"]

    game_id = str(uuid.uuid4())[:4].upper()
    create_game(game_id, password, user, color)
    return jsonify({"game_id": game_id})


@app.route("/api/join_game/<game_id>", methods=["POST"])
def join_game(game_id):
    data = request.get_json()
    password = data["password"]
    user = data["user"]
    user_id = user.get("id")
    user_name = user.get("name")

    if game_id not in games:
        return jsonify({"error_message": "Game not found", "status": 404}), 404

    if password != games[game_id]["password"]:
        error_response = {
            "error_message": "Incorrect game password. Access denied.",
            "status": 401,
        }
        return jsonify(error_response), 401

    player_1_id = games[game_id]["player_1"]["id"]
    player_2_id = games[game_id]["player_2"]["id"]

    if player_1_id == user_id:
        return jsonify({"game_id": game_id, "message": "User is already in the game."})

    if player_2_id:
        if player_2_id == user_id:
            return jsonify(
                {
                    "game_id": game_id,
                    "message": "User is already in the game.",
                }
            )
        else:
            error_response = {
                "error_message": "The game is full. Cannot join.",
                "status": 409,
            }
            return jsonify(error_response), 409
    else:
        games[game_id]["player_2"]["id"] = user_id
        games[game_id]["player_2"]["name"] = user_name

    return jsonify({"game_id": game_id, "status": 200})


@app.route("/api/game/<game_id>", methods=["GET", "POST"])
def game(game_id):
    if game_id not in games:
        return jsonify({"error_message": "Game not found", "status": 404}), 404
    valid_moves = generate_valid_moves(game_id)
    if request.method == "GET":
        game_password = games[game_id]["password"]
        return jsonify(
            {
                "game_id": game_id,
                "password": game_password,
                "board": games[game_id]["board"].get_piece_locations(),
                "valid_moves": valid_moves,
                "player_1": games[game_id]["player_1"],
                "player_2": games[game_id]["player_2"],
            }
        )
    elif request.method == "POST":
        data = request.get_json()
        if "old_pos" not in data or "new_pos" not in data:
            return jsonify({"error_message": "Invalid request"}), 405
        old_pos = tuple(map(int, data["old_pos"].split(",")))
        new_pos = tuple(map(int, data["new_pos"].split(",")))
        games[game_id]["board"].move_piece(old_pos, new_pos)
        return jsonify({"board": games[game_id]["board"].get_piece_locations(), "valid_moves": valid_moves})
    else:
        return jsonify({"error_message": "Invalid method"}), 405


@socketio.on("join_room")
def handle_join_room(data):
    room = data.get("room")
    user = json.loads(data.get("user"))
    join_room(room)

    system_message = f"{user.get('name')} has joined the game."
    messages[room].append(
        {
            "user_id": user.get("id"),
            "user_name": user.get("name"),
            "message": system_message,
            "system": True,
        }
    )
    socketio.emit("receive_message", messages[room], to=room)


@socketio.on("send_message")
def handle_send_message(data):
    room = data.get("room")
    user = json.loads(data.get("user"))
    user_id = user.get("id")
    user_name = user.get("name")
    message_content = data.get("message")

    message = {"user_id": user_id, "user_name": user_name, "message": message_content}
    messages[room].append(message)
    socketio.emit("receive_message", messages[room], to=room)


@socketio.on("send_move")
def handle_send_move(data):
    room = data.get("room")
    
    response_data = {
        "board": games[room]["board"].get_piece_locations(),
        "valid_moves": generate_valid_moves(room),
    }
    
    socketio.emit("receive_move", response_data, to=room)

