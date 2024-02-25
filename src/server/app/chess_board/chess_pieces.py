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
        # Check below the current position
        for i in range(y + 1, len(board[x])):
            tile = board[x][i]
            if tile.type == TileType.DIAMOND:
                continue
            if not tile.is_empty() or tile.type == TileType.PADDING:
                break
            valid_moves.append((x, i))
        # Check above the current position
        for i in range(y - 1, -1, -1):
            tile = board[x][i]
            if tile.type == TileType.DIAMOND:
                continue
            if not tile.is_empty() or tile.type == TileType.PADDING:
                break
            valid_moves.append((x, i))

        # Check for valid moves in the horizontal direction
        # Check to the right of the current position
        for i in range(x - 1, -1, -1):
            tile = board[i][y]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                break
            if tile.type == TileType.DIAMOND:
                y += 1
                valid_moves.append((i, y))
                continue
            elif tile.type == TileType.NORMAL and board[i][y - 1].type == TileType.DIAMOND:
                valid_moves.append((i, y))
                y -= 1
                continue
            elif tile.type == TileType.NORMAL:
                valid_moves.append((i, y))
                continue
        # Check to the left of the current position
        for i in range(x + 1, len(board)):
            tile = board[i][y]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                break
            if tile.type == TileType.DIAMOND:
                y -= 1
                valid_moves.append((i, y))
                continue
            elif tile.type == TileType.NORMAL and board[i][y + 1].type == TileType.DIAMOND:
                valid_moves.append((i, y))
                y += 1
                continue
            elif tile.type == TileType.NORMAL:
                valid_moves.append((i, y))
                continue

        return valid_moves
