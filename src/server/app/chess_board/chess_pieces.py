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
        return super().filter_moves(potential_moves, board, True)


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
                if super().can_capture(x, i, board):
                    valid_moves.append((x, i))
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
                if super().can_capture(i, y, board):
                    valid_moves.append((i, y))
                break

            # If the tile is a diamond, check the tile above or below it
            if tile.type == TileType.DIAMOND:
                y += 1
                if board[i][y].is_empty():
                    valid_moves.append((i, y))
                else:
                    if super().can_capture(i, y, board):
                        valid_moves.append((i, y))
                    break
            elif tile.orientation == 0:
                if board[i][y].is_empty():
                    valid_moves.append((i, y))
                    y -= 1
                else:
                    if super().can_capture(i, y, board):
                        valid_moves.append((i, y))
                    break
            elif board[i][y].is_empty():  # tile is normal
                valid_moves.append((i, y))
            else:
                if super().can_capture(i, y, board):
                    valid_moves.append((i, y))
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
        return super().filter_moves(potential_moves, board, True)


class Mammoth(ChessPiece):  # Author: Nida
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
        return super().filter_moves(potential_moves, board, True)


class Shield(ChessPiece):  # Author: Nida
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
        return super().filter_moves(potential_moves, board, True)


class Cat(ChessPiece):  # Author: Nida

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
        return super().filter_moves(potential_moves, board, True)


class Hawk(ChessPiece):  # Author: Nida

    def __init__(self, color: int) -> None:
        """
        Initializes a hawk piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.HAWK, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the hawk piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves 2 or 3 rhombuses (not 1) like a Queen but may leap to them.
        The move across a wide-angle vertex is to 2 rhombuses only.
        The Hawk may escape the initial setup on its first move.
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
                (x, y - 6),
                (x + 2, y + 1),
                (x + 2, y + 3),
                (x - 2, y + 1),
                (x - 2, y + 3),
                (x, y + 4),
                (x, y + 6),
                (x - 8, y),
                (x + 8, y),
                # above hawk
                (x + 3, y - 2),
                (x + 3, y - 5),
                (x - 3, y - 2),
                (x - 3, y - 5),
                # below hawk
                (x + 3, y + 1),
                (x + 3, y + 4),
                (x - 3, y + 1),
                (x - 3, y + 4),
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
                (x + 2, y + 3),
                (x + 6, y + 3),
                (x + 3, y + 5),
                (x, y + 3),
                (x - 3, y + 2),
                (x - 6, y),
                (x - 6, y - 3),
                (x + 3, y - 1),
                (x + 6, y),
                (x, y - 3),
                (x - 4, y + 6),
                (x + 4, y - 6),
                (x - 3, y - 4),
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
                (x + 2, y - 3),
                (x - 4, y - 6),
                (x + 4, y + 6),
                (x + 6, y),
                (x, y - 3),
                (x + 3, y - 4),
                (x, y + 3),
                (x - 3, y + 5),
                (x - 3, y - 1),
                (x - 6, y),
                (x - 6, y + 3),
                (x + 6, y - 3),
                (x + 3, y + 2),
            ]
        return super().filter_moves(potential_moves, board, True)


class Prince(ChessPiece):  # Author: Nida
    def __init__(self, color: int) -> None:
        """
        Initializes a prince piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.PRINCE, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the prince piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves exactly like a King but is not subject to check and may be captured.
        """
        return King(self.color).calculate_valid_moves(position, board)


class Dog(ChessPiece):  # Author: Phil
    def __init__(self, color: int) -> None:
        """
        Initializes a king piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.DOG, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the dog piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves 1 or 2 rhombuses like a Jester but may leap to the second rhombus. The
        move across a wide-angle vertex is to 1 rhombus only. All 3 dogs may escape the
        initial setup on their first move.
        """

        valid_moves = []
        x, y = position
        tile = board[x][y]
        if tile.orientation == 0:
            potential_moves = [(x, y + 2), (x, y + 4), (x, y - 2), (x, y - 4), (x - 4, y), (x + 4, y)]
        elif tile.orientation == 1:
            potential_moves = [
                (x - 2, y - 1),
                (x - 4, y - 2),
                (x - 2, y + 3),
                (x + 2, y - 3),
                (x + 2, y + 1),
                (x + 4, y + 2),
            ]
        else:
            potential_moves = [
                (x + 4, y - 2),
                (x + 2, y - 1),
                (x + 2, y + 3),
                (x - 2, y - 3),
                (x - 2, y + 1),
                (x - 4, y + 2),
            ]
        return super().filter_moves(potential_moves, board, True)


class Bishop(ChessPiece):  # Author: Anant
    def __init__(self, color: int) -> None:
        """
        Initializes a bishop piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.BISHOP, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the bishop piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves in 1 of 4 directions, 1 or more steps in a straight line along rhombuses with a common vertex and colour. 
        It does not leap.
        """
        orientation = board[position[0]][position[1]].orientation
        potential_moves = []

        if orientation == 0:
            potential_moves += self.move(position, board, "up", True)
            potential_moves += self.move(position, board, "up", False)
            potential_moves += self.move(position, board, "down", True)
            potential_moves += self.move(position, board, "down", False)
        elif orientation == 1:
            potential_moves += self.move(position, board, "up", True)
            potential_moves += self.move(position, board, "down", False)
            potential_moves += self.move_lr(position, board, True)
        else:
            potential_moves += self.move(position, board, "down", True)
            potential_moves += self.move(position, board, "up", False)
            potential_moves += self.move_lr(position, board, True)
        valid_moves = []
        for move in potential_moves:
            tile = board[move[0]][move[1]]
            if tile.piece and tile.piece.color == self.color:
                continue
            valid_moves.append(move)
        return valid_moves

    def move(
        self, position: tuple[int, int], board: list[list[ChessTile]], direction: str, right: bool
    ) -> tuple[list[tuple[int]]]:
        """
        Move the bishop piece in the given direction diagonally
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
            direction: The direction to move the piece in ("up" or "down")
            right: gathers the potential moves to the right if True, else to the left
        Returns:
            A list of potential moves
        """
        x, y = position
        potential_moves = []
        move = range(x - 1, -1, -1) if right else range(x + 1, len(board))

        for i in move:
            if direction == "down":
                if y > len(board[i]) - 2 and board[i][y].type != TileType.PADDING:
                    if board[i][y].is_empty():
                        potential_moves.append((i, y))
                    elif super().can_capture(i, y, board):
                        potential_moves.append((i, y))
                    break
                if board[i][y].orientation == 0:
                    y += 2
                else:
                    y += 1
            elif direction == "up":
                if y <= 0:
                    break
                if board[i][y].orientation == 0:
                    y -= 1
                else:
                    y -= 2
            if board[i][y].type == TileType.PADDING:
                break
            if board[i][y].is_empty():
                potential_moves.append((i, y))
            elif super().can_capture(i, y, board):
                potential_moves.append((i, y))
                break
            else:
                break
        return potential_moves

    def move_lr(
        self, position: tuple[int, int], board: list[list[ChessTile]], direction: bool
    ) -> list[tuple[int, int]]:
        """
        Move the bishop piece in the given direction left or right
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
            direction: The direction to move the piece in (True for right, False for left)
        Returns:
            A list of potential moves
        """
        x, y = position
        color = board[x][y].color
        potential_moves = []
        move = range(x - 1, -1, -1) if direction else range(x + 1, len(board) - 1)
        for i in move:
            if board[i][y].is_empty() and board[i][y].type != TileType.PADDING:
                if board[i][y].color == color:
                    potential_moves.append((i, y))
            elif super().can_capture(i, y, board) and board[i][y].color == color:
                potential_moves.append((i, y))
                break
            else:
                break
        return super().filter_moves(potential_moves, board) + (
            self.move_lr(position, board, False) if direction else []
        )


class Elephant(ChessPiece):  # Author: Anant
    def __init__(self, color: int) -> None:
        """
        Initializes a elephant piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.ELEPHANT, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the elephant piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves 1 or 2 rhombuses like a Bishop but may leap to the second rhombus.
        """
        valid_moves = []
        x, y = position
        tile = board[x][y]
        potential_moves = []
        if tile.orientation == 1:
            potential_moves = [
                (x - 1, y - 1),
                (x - 2, y - 3),
                (x - 2, y),
                (x - 4, y),
                (x + 2, y),
                (x + 4, y),
                (x + 1, y + 2),
                (x + 2, y + 3),
            ]
        elif tile.orientation == -1:
            potential_moves = [
                (x + 2, y),
                (x + 4, y),
                (x + 1, y - 1),
                (x - 1, y + 2),
                (x - 2, y + 3),
                (x + 2, y - 3),
                (x - 2, y),
                (x - 4, y),
            ]
        else:
            potential_moves = [
                (x - 1, y + 1),
                (x + 1, y + 1),
                (x - 1, y - 2),
                (x + 1, y - 2),
                (x - 2, y - 3),
                (x + 2, y - 3),
                (x - 2, y + 3),
                (x + 2, y + 3),
            ]
        return super().filter_moves(potential_moves, board, True)


class Knight(ChessPiece):  # Author: Phil
    def __init__(self, color: int) -> None:
        """
        Initializes a Knight piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.KNIGHT, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the knight piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves (and may leap) 2 rhombuses like a Rook followed by 1 rhombus outwards
        (at a 1/3 turn, i.e. 120°), or 1 rhombus followed by 2 likewise. A Knight’s move
        always changes the colour of its rhombus. Both Knights may escape the initial
        setup on their first move. See ex. R-Mach-N-K.       
        """

        valid_moves = []
        x, y = position
        tile = board[x][y]
        if tile.orientation == 0:
            potential_moves = [
                (x + 1, y - 3),
                (x - 1, y - 3),
                (x + 3, y),
                (x + 3, y - 1),
                (x - 3, y - 1),
                (x - 3, y),
                (x + 1, y + 2),
                (x - 1, y + 2),
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x + 2, y - 2),
                (x + 1, y - 2),
                (x - 2, y - 2),
                (x - 3, y),
                (x + 3, y + 1),
                (x + 2, y + 2),
                (x - 1, y + 3),
                (x - 2, y + 2),
            ]
        else:
            potential_moves = [
                (x + 2, y - 2),
                (x - 1, y - 2),
                (x - 2, y - 2),
                (x + 3, y),
                (x + 2, y + 2),
                (x + 1, y + 3),
                (x - 2, y + 2),
                (x - 3, y + 1),
            ]
        return super().filter_moves(potential_moves, board, True)


class Jester(ChessPiece):  # Author: Phil
    def __init__(self, color: int) -> None:
        """
        Initializes a jester piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.JESTER, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the jester piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves in 1 of 4 directions, 1 or more steps in a straight line across a vertex of its rhombus. It does not leap
        """
        valid_moves = []
        x, y = position
        valid_moves.extend(self.left(x, y, board))
        valid_moves.extend(self.right(x, y, board))
        valid_moves.extend(self.up(x, y, board))
        valid_moves.extend(self.down(x, y, board))
        return valid_moves

    def left(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []

        if current_tile.orientation == 0:
            for i in range(x + 4, 17, 4):
                current_tile = board[i][y]
                if current_tile.type == TileType.PADDING:
                    break
                if not current_tile.is_empty():
                    if current_tile.piece.color != self.color:
                        valid_moves.append((i, y))
                    break
                valid_moves.append((i, y))
        elif current_tile.orientation == 1:
            a, b = x + 2, y - 3
            while a < len(board) and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a, b))
                a += 2
                b -= 3
            if (
                a < len(board)
                and b > 0
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        else:
            a, b = x + 2, y + 3
            while (
                a < len(board)
                and b < (len(board[a]) - 1)
                and board[a][b].is_empty()
                and (not (board[a][b].type == TileType.PADDING))
            ):
                valid_moves.append((a, b))
                a += 2
                b += 3
            if (
                a < len(board)
                and b < (len(board[a]) - 1)
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))

        return valid_moves

    def right(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []
        if current_tile.orientation == 0:
            for i in range(x - 4, -1, -4):
                current_tile = board[i][y]
                if current_tile.type == TileType.PADDING:
                    break
                if not current_tile.is_empty():
                    if current_tile.piece.color != self.color:
                        valid_moves.append((i, y))
                    break
                valid_moves.append((i, y))
        elif current_tile.orientation == 1:
            a, b = x - 2, y + 3
            while (
                a > 0
                and b < (len(board[a]) - 1)
                and board[a][b].is_empty()
                and (not (board[a][b].type == TileType.PADDING))
            ):
                valid_moves.append((a, b))
                a -= 2
                b += 3
            if (
                a > 0
                and b < (len(board[a]) - 1)
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        else:
            a, b = x - 2, y - 3
            while a > 0 and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a, b))
                a -= 2
                b -= 3
            if (
                a > 0
                and b > 0
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        return valid_moves

    def up(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []
        if current_tile.orientation == 0:
            b = y - 1
            while board[x][b].is_empty() and (not (board[x][b].type == TileType.PADDING)):
                if board[x][b].type == TileType.DIAMOND:
                    b -= 1
                    continue
                valid_moves.append((x, b))
                b -= 1
            if b > 0 and board[x][b].type != TileType.PADDING and board[x][b].piece.color != self.color:
                valid_moves.append((x, b))
        elif current_tile.orientation == 1:
            a, b = x - 2, y - 1
            while a > 0 and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a, b))
                a -= 2
                b -= 1
            if (
                a > 0
                and b > 0
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        else:
            a, b = x + 2, y - 1
            while a < len(board) and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a, b))
                a += 2
                b -= 1
            if (
                a < len(board)
                and b > 0
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        return valid_moves

    def down(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []
        if current_tile.orientation == 0:
            b = y + 1
            while board[x][b].is_empty() and (not (board[x][b].type == TileType.PADDING)):
                if board[x][b].type == TileType.DIAMOND:
                    b += 1
                    continue
                valid_moves.append((x, b))
                b += 1
            if (
                b < (len(board[x]) - 1)
                and board[x][b].type != TileType.PADDING
                and board[x][b].piece.color != self.color
            ):
                valid_moves.append((x, b))
        elif current_tile.orientation == 1:
            a, b = x + 2, y + 1
            while (
                a < len(board)
                and b < (len(board[a]) - 1)
                and board[a][b].is_empty()
                and (not (board[a][b].type == TileType.PADDING))
            ):
                valid_moves.append((a, b))
                a += 2
                b += 1
            if (
                a < len(board)
                and b < (len(board[a]) - 1)
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        else:
            a, b = x - 2, y + 1
            while (
                a > 0
                and (len(board[a]) - 1)
                and board[a][b].is_empty()
                and (not (board[a][b].type == TileType.PADDING))
            ):
                valid_moves.append((a, b))
                a -= 2
                b += 1
            if (
                a > 0
                and b < (len(board[a]) - 1)
                and board[a][b].type != TileType.PADDING
                and (board[a][b].is_empty() or board[a][b].piece.color != self.color)
            ):
                valid_moves.append((a, b))
        return valid_moves


class Pawn(ChessPiece):
    def __init__(self, color: int, move_conditions=None) -> None:
        """
        Initializes a pawn piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.PAWN, color)
        self.mimic_conditions = move_conditions

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the pawn piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: 
        1. On a vertical rhombus: 
        Moves 1 step forward like a Jester and captures 1 step forward onto the nearest non-vertical rhombuses, contiguous by side or vertex.
        2. On a non-vertical rhombus: 
        Moves 1 step forward like a Rook, or 2 such steps if there is no intervening piece. 
        It captures 1 step forward onto the nearest vertical rhombuses, contiguous by side or vertex.
        """
        valid_moves = []
        potential_moves = []
        x, y = position
        tile = board[x][y]
        direction = -1 if self.color == 1 else 1

        def pawn_capture_conditions(a: int, b: int) -> bool:
            if a < 0 or a >= len(board) or b < 0 or b >= len(board[a]):
                return False
            return not board[a][b].is_empty() and board[a][b].piece.color != self.color

        filter_cond = self.mimic_conditions if self.mimic_conditions else pawn_capture_conditions

        if tile.orientation == 0:
            potential_moves.append((x, y + (direction * 2)))
            valid_moves += filter(
                lambda loc: filter_cond(loc[0], loc[1]),
                [
                    (x + 1, y + direction if direction == -1 else y),
                    (x - 1, y + direction if direction == -1 else y),
                    (x - 1, y + (direction * 2) if direction == -1 else y + (direction)),
                    (x + 1, y + (direction * 2) if direction == -1 else y + (direction)),
                ],
            )
        else:
            potential_moves.append((x, y + direction))
            potential_moves.append((x, y + (direction * 2)))
            if tile.orientation == -1:
                valid_moves += filter(
                    lambda loc: filter_cond(loc[0], loc[1]),
                    [
                        (x + 1, y - 1 if direction == -1 else y + 1),
                        (x - 1, y if direction == -1 else y + 2),
                    ],
                )
            else:
                valid_moves += filter(
                    lambda loc: filter_cond(loc[0], loc[1]),
                    [
                        (x + 1, y if direction == -1 else y + 2),
                        (x - 1, y - 1 if direction == -1 else y + 1),
                    ],
                )
        for move in potential_moves:
            if move[1] < 0 or move[0] > len(board) - 1:
                continue
            tile = board[move[0]][move[1]]
            if not tile.is_empty():
                break
            valid_moves.append(move)
        return valid_moves


class Queen(ChessPiece):  # Author: Phil

    def __init__(self, color: int) -> None:
        """
        Initializes a cat piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.QUEEN, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the queen piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: Moves in 1 of 12 directions, 1 or more rhombuses in a straight line like a Rook,
        Bishop, or Jester. It does not leap.         
        """
        valid_moves = set()

        rook_init = Rook(self.color)
        bishop_init = Bishop(self.color)
        jester_init = Jester(self.color)

        valid_moves.update(rook_init.calculate_valid_moves(position, board))
        valid_moves.update(bishop_init.calculate_valid_moves(position, board))
        valid_moves.update(jester_init.calculate_valid_moves(position, board))

        return list(valid_moves)


class Soldier(ChessPiece):
    def __init__(self, color: int) -> None:
        """
        Initializes a soldier piece
        Args:
            color (int): color of the piece
        """
        super().__init__(PieceType.SOLDIER, color)

    def calculate_valid_moves(self, position: tuple[int, int], board: list[list[ChessTile]]) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the soldier piece from the given position
        Args:
            position: The current position of the piece on the board
            board: The chess board in its current state
        Returns:
            A list of valid moves
        """
        """
        Rule: On a vertical rhombus. Moves and captures like a Pawn on a similar rhombus.
        Without capturing, it also moves to the rhombuses of capture.
        On a non-vertical rhombus. Moves and captures like a Pawn on a similar rhombus.
        Without capturing, it also moves to the rhombuses of capture.
        (This soldier does not capture in the direction of a Jester or Dog).
        """

        def can_capture(a: int, b: int) -> bool:
            if a < 0 or a >= len(board) or b < 0 or b >= len(board[a]):
                return False
            return (board[a][b].is_empty()) or (not board[a][b].is_empty() and board[a][b].piece.color != self.color)

        pawn = Pawn(self.color, can_capture)
        return pawn.calculate_valid_moves(position, board)
