from flask import jsonify, request
from app import app
from app.chess_board.board import ChessBoard
import uuid

games: dict[str,ChessBoard] = {}

def create_game(game_id):
    games[game_id] = ChessBoard()

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Hello World!"
    })

@app.route("/api/new_game", methods=['POST'])
def new_game():
    game_id = str(uuid.uuid4())[:4]
    create_game(game_id)
    return jsonify({
        'game_id': game_id
    })

@app.route("/api/game/<game_id>", methods=['GET', 'POST'])
def game(game_id):
    if game_id not in games:
        return jsonify({
            'message': "Game not found"
        })
    if request.method == 'GET':
        return jsonify({
            'board': games[game_id].get_piece_locations()
        })
    elif request.method == 'POST':
        data = request.get_json()
        if 'old_pos' not in data or 'new_pos' not in data:
            return jsonify({
                'message': "Invalid request"
            })
        old_pos = int(data['old_pos'].split(',')[0]), int(data['old_pos'].split(',')[1])
        new_pos = int(data['new_pos'].split(',')[0]), int(data['new_pos'].split(',')[1])
        games[game_id].move_piece(old_pos, new_pos)
        return jsonify({
            'board': games[game_id].get_piece_locations()
        })
    else:
        return jsonify({
            'message': "Invalid method"
        })