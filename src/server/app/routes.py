import json
import uuid
import time

from app import app, socketio
from app.chess_board.board import ChessBoard
from flask import jsonify, request
from flask_socketio import SocketIO, join_room
from threading import Thread

games: dict[str, dict] = {}

messages: dict[str, list] = {}


def generate_valid_moves(game_id):
    valid_moves = {}
    for key, value in games[game_id]["board"].valid_moves.items():
        if value:
            key_str = f"{key[0]},{key[1]}"
            valid_moves[key_str] = [
                f"{move[0]},{move[1]}" for move in value
            ]
    return valid_moves


def create_game(game_id, password, user, color, timer_duration, local = False):
    opposite_color = "white" if color == "black" else "black"

    player1 = {"id": user["id"], "name": user['name'], "color": color, "timer_duration": timer_duration, "timer_running": False}
    player2 = {"id": None, "name": None, "color": opposite_color, "timer_duration": timer_duration, "timer_running": False}
    
    if local:
        player1 = {"id": user["id"], "name": "Player #1", "color": color, "timer_duration": timer_duration, "timer_running": color == 'white'}
        player2 = {"id": user["id"], "name": "Player #2", "color": opposite_color, "timer_duration": timer_duration, "timer_running": opposite_color == 'white'}

    games[game_id] = {
        "password": password,
        "board": ChessBoard(),
        "player_1": player1,
        "player_2": player2,
    }
    messages[game_id] = []

    start_timer(game_id, "player_1")
    start_timer(game_id, "player_2")

@app.route("/api/initial_board", methods=["GET"])
def initial_board():
    return jsonify({ "board": ChessBoard().get_piece_locations() })

@app.route("/api/new_game", methods=["POST"])
def new_game():
    data = request.get_json()
    user = data["user"]
    color = data["color"]
    local = data.get("local", "")
    password = data.get("password", "")
    timer_duration = data.get("timer_duration", "")

    game_id = str(uuid.uuid4())[:4].upper()
    create_game(game_id, password, user, color, timer_duration, local)
    return jsonify({"game_id": game_id})


@socketio.on("timer_update")
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

        games[game_id]["player_1"]["timer_running"] = games[game_id]["player_1"]['color'] == 'white'
        games[game_id]["player_2"]["timer_running"] = games[game_id]["player_2"]['color'] == 'white'
        response_data = {
            'game_id': game_id,
            'timer_duration_p1': games[game_id]["player_1"]["timer_duration"],
            'timer_duration_p2': games[game_id]["player_2"]["timer_duration"],
            'timer_running_p1': games[game_id]["player_1"]["timer_running"],
            'timer_running_p2': games[game_id]["player_2"]["timer_running"]
        }
        socketio.emit('timer_update', response_data,  to=data.get("room"))

    return jsonify({"game_id": game_id, "status": 200})


@socketio.on("timer_update")
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
        games[game_id]["player_1"]["timer_running"] = not games[game_id]["player_1"]["timer_running"]
        games[game_id]["player_2"]["timer_running"] = not games[game_id]["player_2"]["timer_running"]
        response_data = {
            'game_id': game_id,
            'timer_duration_p1': games[game_id]["player_1"]["timer_duration"],
            'timer_duration_p2': games[game_id]["player_2"]["timer_duration"],
            'timer_running_p1': games[game_id]["player_1"]["timer_running"],
            'timer_running_p2': games[game_id]["player_2"]["timer_running"]
        }
        socketio.emit('timer_update', response_data,  to=data.get("room"))
        return jsonify({"board": games[game_id]["board"].get_piece_locations(), "valid_moves": valid_moves})
    else:
        return jsonify({"error_message": "Invalid method"}), 405
    

@socketio.on("timer_update")
def timer(game_id, player_key):
    while games[game_id]['player_1']["timer_duration"] > 0 and games[game_id]['player_2']["timer_duration"] > 0:
        if games[game_id][player_key]["timer_running"] and games[game_id][player_key]["timer_duration"] > 0:
            time.sleep(1)
            games[game_id][player_key]["timer_duration"] -= 1


def start_timer(game_id, player_key):
    thread = Thread(target=timer, args=(game_id, player_key))
    thread.start()


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

