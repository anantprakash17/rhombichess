from flask.testing import FlaskClient
import pytest
from app import app
import time


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


game_id = None
game_ids = []


def test_new_game(client: FlaskClient):
    response = client.post(
        "/api/new_game",
        json={
            "password": "value",
            "color": "black",
            "user": {"id": "123", "name": "Captain America"},
            "timer_duration": 0,
        },
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "game_id" in data
    global game_id
    game_id = data["game_id"]


def test_join_game_not_found(client: FlaskClient):
    response = client.post(
        "/api/join_game/999999",
        json={"password": "value", "user": {"id": "123", "name": "Captain America"}},
    )
    assert response.status_code == 404
    assert response.get_json() == {"error_message": "Game not found", "status": 404}


def test_join_game_already_in_game(client: FlaskClient):
    response = client.post(
        f"/api/join_game/{game_id}",
        json={"password": "value", "user": {"id": "123", "name": "Captain America"}},
    )
    assert response.status_code == 200
    assert response.get_json() == {
        "game_id": game_id,
        "message": "User is already in the game.",
    }


def test_join_game_incorrect_password(client: FlaskClient):
    response = client.post(
        f"/api/join_game/{game_id}",
        json={"password": "wrong", "user": {"id": "123", "name": "Captain America"}},
    )
    assert response.status_code == 401
    assert response.get_json() == {
        "error_message": "Incorrect game password. Access denied.",
        "status": 401,
    }


def test_join_game_success(client: FlaskClient):
    response = client.post(
        f"/api/join_game/{game_id}",
        json={"password": "value", "user": {"id": "789", "name": "Iron Man"}},
    )
    assert response.status_code == 200
    assert response.get_json() == {"game_id": game_id, "status": 200}


def test_join_game_full(client: FlaskClient):
    response = client.post(
        f"/api/join_game/{game_id}",
        json={"password": "value", "user": {"id": "456", "name": "Spiderman"}},
    )
    assert response.status_code == 409
    assert response.get_json() == {
        "error_message": "The game is full. Cannot join.",
        "status": 409,
    }


def test_game_not_found(client: FlaskClient):
    response = client.get("/api/game/999999")
    assert response.status_code == 404
    assert response.get_json() == {"error_message": "Game not found", "status": 404}


def test_game_get(client: FlaskClient):
    response = client.get(f"/api/game/{game_id}")
    assert response.status_code == 200
    data = response.get_json()
    assert "game_id" in data
    assert "password" in data
    assert "board" in data
    assert "player_1" in data
    assert "player_2" in data


def test_game_post_invalid_request(client: FlaskClient):
    response = client.post(f"/api/game/{game_id}", json={"invalid": "request"})
    assert response.status_code == 405
    assert response.get_json() == {"error_message": "Invalid request"}


def test_game_post_move_piece(client: FlaskClient):
    response = client.post(f"/api/game/{game_id}", json={"old_pos": "1,5", "new_pos": "1,7"})
    assert response.status_code == 200
    assert "board" in response.get_json()


@pytest.mark.dependency()
def test_handle_multiple_games(client: FlaskClient):
    start_time = time.time()
    for _ in range(50):
        response = client.post(
            "/api/new_game",
            json={
                "password": "value",
                "color": "black",
                "user": {"id": "123", "name": "Captain America"},
                "timer_duration": 0,
            },
        )
        assert response.status_code == 200
        game_ids.append(response.get_json()["game_id"])
    end_time = time.time()
    print(f"Time taken to create 50 games: {end_time - start_time} seconds")
    for game_id in game_ids:
        response = client.get(f"/api/game/{game_id}")
        assert response.status_code == 200


def test_repeated_calls(client: FlaskClient):
    # Invalid game
    response1 = client.get("/api/game/1234")
    response2 = client.get("/api/game/1234")
    assert response1.status_code == 404
    assert response1.get_json() == response2.get_json()

    # New game
    response3 = client.post(
        "/api/new_game",
        json={
            "password": "value",
            "color": "black",
            "user": {"id": "123", "name": "Captain America"},
            "timer_duration": 0,
        },
    )
    response4 = client.post(
        "/api/new_game",
        json={
            "password": "value",
            "color": "black",
            "user": {"id": "123", "name": "Captain America"},
            "timer_duration": 0,
        },
    )
    assert response3.status_code == 200
    assert response3.get_json()["game_id"] != response4.get_json()["game_id"]

    # Join game
    response5 = client.post(
        f"/api/join_game/{game_id}",
        json={"password": "value", "user": {"id": "123", "name": "Captain America"}},
    )
    response6 = client.post(
        f"/api/join_game/{game_id}",
        json={"password": "value", "user": {"id": "123", "name": "Captain America"}},
    )
    assert response5.status_code == 200
    assert response5.get_json() == response6.get_json()


def test_new_game_player_color(client: FlaskClient):
    response = client.post(
        "/api/new_game",
        json={
            "password": "value",
            "color": "black",
            "user": {"id": "123", "name": "Captain America"},
            "timer_duration": 0,
        },
    )
    data = response.get_json()
    game_id = data["game_id"]
    game_data = client.get(f"/api/game/{game_id}").get_json()
    assert game_data["player_1"]["color"] == "black"
    assert game_data["player_2"]["color"] == "white"


def test_game_post_move_piece_correct_game(client: FlaskClient):
    get_board = client.get(f"/api/game/{game_id}").get_json()["board"]
    assert get_board["(1, 7)"]["piece"] == "pawn-black"
    response = client.post(f"/api/game/{game_id}", json={"old_pos": "1,7", "new_pos": "1,9"})
    data = response.get_json()
    board = data["board"]
    assert board["(1, 9)"]["piece"] == "pawn-black"
    assert board["(1, 7)"]["piece"] == ""
