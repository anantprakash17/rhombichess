from app.chess_board.chess_objects import ChessPiece, ChessTile, PieceType, TileType


class King(ChessPiece):
    def __init__(self, color: int) -> None:
        """
        Initializes a king piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.KING, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the king piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves one tile in any direction if permitted by other constraints
        """

        valid_moves = []
        x, y = position
        tile = board[x][y]
        if tile.orientation == 0:
            potential_moves = [
                (x, y - 2),
                (x, y + 2),
                (x + 1, y - 2),
                (x - 1, y - 2),
                (x + 1, y - 1),
                (x - 1, y - 1),
                (x + 1, y),
                (x - 1, y),
                (x - 1, y + 1),
                (x + 1, y + 1),
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x, y - 1),
                (x + 1, y + 2),
                (x - 1, y - 1),
                (x - 2, y - 1),
                (x + 2, y),
                (x + 1, y),
                (x - 2, y),
                (x + 2, y + 1),
                (x, y + 1),
                (x - 1, y + 1),
            ]
        else:
            potential_moves = [
                (x, y - 1),
                (x + 1, y + 1),
                (x + 1, y - 1),
                (x + 2, y),
                (x + 2, y - 1),
                (x, y + 1),
                (x - 1, y + 2),
                (x - 1, y),
                (x - 2, y),
                (x - 2, y + 1),
            ]
        for move in potential_moves:
            if move[1] < 0 or move[0] > len(board) - 1:
                continue
            tile = board[move[0]][move[1]]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                continue
            valid_moves.append(move)
        return valid_moves


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
        # Check if piece is on diamond tile and add valid moves from the diamond tile
        if board[x][y].orientation == 0:
            valid_moves.extend(self.horizontal(x, y - 1, board, True))
            valid_moves.extend(self.horizontal(x, y - 1, board, False))

        return valid_moves

    def vertical(self, x: int, y: int, board: list[list[ChessTile]], up: bool) -> list[tuple[int, int]]:
        valid_moves = []
        move = range(y - 1, -1, -1) if up else range(y + 1, len(board[x]))
        for i in move:
            tile = board[x][i]
            # If the tile is not empty or a padding tile or on diamond tiles, break the loop
            if not tile.is_empty() or tile.type == TileType.PADDING or tile.orientation == 0:
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
                y += 1
                if board[i][y].is_empty():
                    valid_moves.append((i, y))
                else:
                    break
            elif tile.orientation == 0:
                if board[i][y].is_empty():
                    valid_moves.append((i, y))
                    y -= 1
                else:
                    break
            elif board[i][y].is_empty():  # tile is normal
                valid_moves.append((i, y))
            else:
                break
        return valid_moves


class Machine(ChessPiece):
    def __init__(self, color: int) -> None:
        """
        Initializes a machine piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.MACHINE, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the machine piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves 1 or 2 rhombuses like a Rook but may leap to the second rhombus.
        """
        valid_moves = []
        x, y = position
        tile = board[x][y]
        potential_moves = []
        if tile.orientation == 0:
            potential_moves = [
                (x + 1, y),
                (x - 1, y),
                (x + 1, y - 1),
                (x - 1, y - 1),
                (x + 2, y + 1),
                (x - 2, y + 1),
                (x + 2, y - 1),
                (x - 2, y - 1),
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x, y + 1),
                (x, y - 1),
                (x, y + 2),
                (x, y - 2),
                (x - 1, y + 1),
                (x + 1, y),
                (x - 2, y + 1),
                (x + 2, y - 1),
            ]
        else:
            potential_moves = [
                (x, y + 1),
                (x, y - 1),
                (x, y + 2),
                (x, y - 2),
                (x - 1, y),
                (x + 1, y + 1),
                (x - 2, y - 1),
                (x + 2, y + 1),
            ]
        for move in potential_moves:
            tile = board[move[0]][move[1]]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                continue
            valid_moves.append(move)
        return valid_moves


class Mammoth(ChessPiece):
    def __init__(self, color: int) -> None:
        """
        Initializes a mammoth piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.MAMMOTH, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the mammoth piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves 1 or 2 rhombuses like a Queen but may leap to the second rhombus.
        The move across a wide-angle vertex is to 1 rhombus only.
        """
        valid_moves = []
        x, y = position
        tile = board[x][y]
        potential_moves = []
        # regular diamond
        if tile.orientation == 0:
            potential_moves = [
                (x, y - 2),
                (x, y - 4),
                (x, y + 2),
                (x + 1, y),
                (x - 1, y),
                (x - 1, y - 1),
                (x + 1, y - 1),
                (x + 1, y + 1),
                (x - 1, y + 1),
                (x - 1, y - 2),
                (x + 1, y - 2),
                (x - 2, y + 1),
                (x + 2, y + 1),
                (x - 2, y - 1),
                (x + 2, y - 1),
                (x - 4, y),
                (x + 4, y),
                (x - 2, y - 3),
                (x + 2, y - 3),
                (x, y + 4),
                (x - 2, y + 3),
                (x + 2, y + 3),
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x - 1, y + 1),
                (x - 2, y),
                (x - 4, y),
                (x + 1, y),
                (x + 2, y),
                (x + 4, y),
                (x, y - 1),
                (x - 2, y - 1),
                (x - 1, y - 1),
                (x + 2, y - 1),
                (x, y - 2),
                (x + 2, y - 3),
                (x - 2, y - 3),
                (x - 4, y - 2),
                (x, y + 1),
                (x, y + 2),
                (x - 2, y + 1),
                (x + 2, y + 1),
                (x + 4, y + 2),
                (x - 2, y + 3),
                (x + 2, y + 3),
                (x + 1, y + 2),
            ]
        else:
            potential_moves = [
                (x - 1, y),
                (x - 2, y),
                (x - 4, y),
                (x + 1, y + 1),
                (x + 2, y),
                (x + 4, y),
                (x, y - 1),
                (x - 2, y - 1),
                (x + 1, y - 1),
                (x + 2, y - 1),
                (x, y - 2),
                (x + 4, y - 2),
                (x - 2, y - 3),
                (x + 2, y - 3),
                (x, y + 1),
                (x, y + 2),
                (x - 1, y + 2),
                (x - 2, y + 1),
                (x + 2, y + 1),
                (x - 4, y + 2),
                (x - 2, y + 3),
                (x + 2, y + 3),
            ]
        for move in potential_moves:
            if move[0] < 0 or move[0] >= len(board):
                continue
            if move[1] < 0 or move[1] >= len(board[move[0]]):
                continue
            tile = board[move[0]][move[1]]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                continue
            valid_moves.append(move)
        return valid_moves


class Shield(ChessPiece):
    def __init__(self, color: int) -> None:
        """
        Initializes a shield piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.SHIELD, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the shield piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves to any rhombus in its 2 regular hexagons. A move in a Rook’s direction
        may be a leap to the 3rd rhombus away. The left and right Shields may escape the
        initial setup on their first move
        """
        valid_moves = []
        x, y = position
        tile = board[x][y]
        potential_moves = []
        if tile.orientation == 0:
            potential_moves = [
                (x + 1, y + 1),
                (x + 3, y + 1),
                (x + 4, y),
                (x + 3, y - 2),
                (x + 1, y - 2),
                (x - 1, y - 2),
                (x - 4, y),
                (x - 1, y + 1),
                (x - 3, y + 1),
                (x - 3, y - 2),
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x - 1, y - 1),
                (x, y - 3),
                (x + 2, y),
                (x + 3, y - 1),
                (x + 2, y - 3),
                (x + 1, y + 2),
                (x, y + 3),
                (x - 2, y + 3),
                (x - 3, y + 2),
                (x - 2, y),
            ]
        else:
            potential_moves = [
                (x - 2, y),
                (x + 2, y),
                (x - 1, y + 2),
                (x + 3, y + 2),
                (x + 2, y + 3),
                (x, y + 3),
                (x + 1, y - 1),
                (x, y - 3),
                (x - 2, y - 3),
                (x - 3, y - 1),
            ]
        for move in potential_moves:
            if move[0] < 0 or move[0] >= len(board):
                continue
            if move[1] < 0 or move[1] >= len(board[move[0]]):
                continue
            tile = board[move[0]][move[1]]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                continue
            valid_moves.append(move)
        return valid_moves


class Cat(ChessPiece):

    def __init__(self, color: int) -> None:
        """
        Initializes a cat piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.CAT, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the cat piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves 2 rhombuses (not 1) like a Queen but may leap.
        The move across a wide-angle vertex is to 1 rhombus only.
        All 3 Cats may escape the initial setup on their first move.
        """
        valid_moves = []
        x, y = position
        tile = board[x][y]
        potential_moves = []
        if tile.orientation == 0:
            potential_moves = [
                (x + 2, y - 1),
                (x + 2, y - 3),
                (x - 2, y - 1),
                (x - 2, y - 3),
                (x, y - 4),
                (x + 2, y + 1),
                (x + 2, y + 3),
                (x - 2, y + 1),
                (x - 2, y + 3),
                (x, y + 4),
                (x - 4, y),
                (x + 4, y),
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x + 2, y - 1),
                (x + 4, y + 2),
                (x, y - 2),
                (x - 4, y - 2),
                (x - 2, y - 3),
                (x - 2, y + 1),
                (x - 4, y),
                (x, y + 2),
                (x + 4, y),
                (x - 2, y + 3),
                (x + 2, y + 3),
                (x + 2, y - 3),
            ]
        else:
            potential_moves = [
                (x + 2, y + 1),
                (x - 4, y + 2),
                (x + 4, y - 2),
                (x, y - 2),
                (x, y + 2),
                (x - 2, y - 1),
                (x - 4, y),
                (x - 2, y + 3),
                (x + 4, y),
                (x + 2, y + 3),
                (x - 2, y - 3),
                (x + 2, y - 3),
            ]
        for move in potential_moves:
            if move[0] < 0 or move[0] >= len(board):
                continue
            if move[1] < 0 or move[1] >= len(board[move[0]]):
                continue
            tile = board[move[0]][move[1]]
            if not tile.is_empty() or tile.type == TileType.PADDING:
                continue
            valid_moves.append(move)
        return valid_moves


