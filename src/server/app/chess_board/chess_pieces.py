from app.chess_board.chess_objects import ChessPiece, ChessTile, PieceType, TileType


class Rook(ChessPiece):
    def __init__(self, color: int) -> None:
        """
        Initializes a rook piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.ROOK, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the rook piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves in 1 of 4 directions, 1 or more steps in a straight line across rhombuses with a common side.
        It does not leap.
        """
        valid_moves = []
        x, y = position
        # Check for valid moves in the vertical direction
        # Check upwards from the current position
        valid_moves.extend(self.vertical(x, y, board, True))
        # Check downwards from the current position
        valid_moves.extend(self.vertical(x, y, board, False))

        # Check for valid moves in the horizontal direction
        # Check to the right of the current position
        valid_moves.extend(self.horizontal(x, y, board, True))
        # Check to the left of the current position
        valid_moves.extend(self.horizontal(x, y, board, False))

        return valid_moves

    def vertical(self, x: int, y: int, board: list[list[ChessTile]], up: bool) -> list[tuple[int, int]]:
        valid_moves = []
        move = range(y - 1, -1, -1) if up else range(y + 1, len(board[x]))
        for i in move:
            tile = board[x][i]
            # Skip the diamond tiles
            if tile.type == TileType.DIAMOND:
                continue
            # If the tile is not empty or a padding tile, break the loop
            if not tile.is_empty() or tile.type == TileType.PADDING:
                break
            valid_moves.append((x, i))
        return valid_moves

    def horizontal(self, x: int, y: int, board: list[list[ChessTile]], right: bool) -> list[tuple[int, int]]:
        valid_moves = []
        move = range(x - 1, -1, -1) if right else range(x + 1, len(board))
        for i in move:
            tile = board[i][y]
            # If the tile is not empty or a padding tile, break the loop
            if not tile.is_empty() or tile.type == TileType.PADDING:
                break

            # If the tile is a diamond, check the tile above or below it
            if tile.type == TileType.DIAMOND:
                y += 1 if right else -1
                if board[i][y].is_empty():
                    valid_moves.append((i, y))

            # Here we check if the tile is a normal tile and the next tile is a diamond
            elif tile.type == TileType.NORMAL:
                next_tile = board[i][y - 1] if right else board[i][y + 1]
                # If the next tile is a diamond, we need to offset the y value
                if next_tile.type == TileType.DIAMOND:
                    y += 1 if right else -1
                    if board[i][y].is_empty():
                        valid_moves.append((i, y))

            else:  # tile is normal
                valid_moves.append((i, y))
        return valid_moves
