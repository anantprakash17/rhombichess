from locust import HttpUser, task, between
import random
import json


class GameSimulationUser(HttpUser):
    wait_time = between(1, 2)  # Define wait time between tasks
    game_id = None  # Initialize game_id to None

    def on_start(self):
        """Create a new game for each user at the start."""
        headers = {"Content-Type": "application/json"}
        response = self.client.post(
            "/api/new_game",
            json={
                "password": "value",
                "color": "black",
                "user": {"id": "123", "name": "Bucky Barns"},
                "timer_duration": 0,
            },
            headers=headers,
        )
        if response.status_code == 200:
            self.game_id = json.loads(response.text)["game_id"]

    @task
    def interact_with_games(self):
        """Interact with the game specific to this user."""
        if self.game_id is not None:  # Check if game_id is set
            headers = {"Content-Type": "application/json"}
            # Perform actions specific to this game
            self.client.get(f"/api/game/{self.game_id}", name="/api/game/[game_id]", headers=headers)
            self.client.post(
                f"/api/join_game/{self.game_id}",
                json={
                    "password": "value",
                    "user": {"id": "789", "name": "Black Widow"},
                },
                name="/api/join_game/[game_id]",
                headers=headers,
            )
            response = self.client.post(
                f"/api/game/{self.game_id}",
                json={"old_pos": "1,5", "new_pos": "1,7"},
                name="/api/game/[game_id]",
                headers=headers,
            )
            valid_moves = json.loads(response.text)["valid_moves"]
            while valid_moves:
                pos, possible_moves = next(iter(valid_moves.items()))
                old_pos, new_pos = pos, random.choice(possible_moves)
                self.client.post(
                    f"/api/game/{self.game_id}",
                    json={"old_pos": old_pos, "new_pos": new_pos},
                    name="/api/game/[game_id]",
                    headers=headers,
                )
                # Get the updated valid moves
                response = self.client.get(f"/api/game/{self.game_id}", name="/api/game/[game_id]", headers=headers)
                valid_moves = json.loads(response.text)["valid_moves"]
        # No more valid moves, create a new game
        self.on_start()
