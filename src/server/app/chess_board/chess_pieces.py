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


class Mammoth(ChessPiece): # Author: Nida
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


class Shield(ChessPiece): # Author: Nida
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


class Cat(ChessPiece): # Author: Nida

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


class Hawk(ChessPiece): # Author: Nida

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


class Prince(ChessPiece): # Author: Nida
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
        valid_moves = []
        x, y = position
        tile = board[x][y]
        potential_moves = []
        # regular diamond
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
                (x - 2, y + 1)
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


class Dog(ChessPiece): # Author: Phil
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
            potential_moves = [
                (x, y + 2),
                (x, y + 4),
                (x, y - 2),
                (x, y - 4),
                (x - 4, y),
                (x + 4, y)
            ]
        elif tile.orientation == 1:
            potential_moves = [
                (x - 2, y - 1),
                (x - 4, y - 2),
                (x - 2, y + 3),
                (x + 2, y - 3),
                (x + 2, y + 1),
                (x + 4, y + 2)
			]
        else:
            potential_moves = [
                (x + 4, y - 2),
                (x + 2, y - 1),
                (x + 2, y + 3),
                (x - 2, y - 3),
                (x - 2, y + 1),
                (x - 4, y + 2)
            ]
        for move in potential_moves:
            if move[1] < 0 or move[0] > len(board) - 1:
                continue
            tile = board[move[0]][move[1]]
            #if not tile.is_empty() or tile.type == TileType.PADDING:
                #continue
            if tile.type == TileType.PADDING or (not tile.is_empty() and tile.piece.color == self.color):
                continue
            valid_moves.append(move)
        return valid_moves


class Bishop(ChessPiece): # Author: Anant
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
        for x, y in potential_moves:
            if x < 0 or x > len(board) - 1 or y < 0 or y > len(board[x]) - 1:
                break
            if not board[x][y].is_empty():
                break
            valid_moves.append((x, y))
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
        color = board[x][y].color
        move = range(x - 1, -1, -1) if right else range(x + 1, len(board))

        for i in move:
            if direction == "down":
                if y > len(board[i]) - 2:
                    if board[i][y].is_empty():
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
            if board[i][y].is_empty():
                potential_moves.append((i, y))
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
            if board[i][y].is_empty():
                if board[i][y].color == color:
                    potential_moves.append((i, y))
            else:
                break
        return potential_moves + (self.move_lr(position, board, False) if direction else [])
