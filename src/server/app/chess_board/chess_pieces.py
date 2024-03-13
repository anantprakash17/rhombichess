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

#I jest
class Jester(ChessPiece):
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
            for i in range(x+4, 17, 4):
                current_tile = board[i][y]
                if current_tile.type == TileType.PADDING:
                    break
                if not current_tile.is_empty():
                    if current_tile.piece.color != self.color :
                        valid_moves.append((i, y))
                    break
                valid_moves.append((i, y))
        elif current_tile.orientation == 1:
            a, b = x + 2, y - 3
            while a < len(board) and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a, b))
                a += 2
                b -= 3
            if a < len(board) and b > 0 and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color: 
                valid_moves.append((a, b))
        else:
            a, b = x + 2, y + 3
            while a < len(board) and b < (len(board[a]) - 1) and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a,b))
                a += 2
                b += 3
            if a < len(board) and b < (len(board[a]) - 1) and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color:
                valid_moves.append((a,b))
            
        return valid_moves

    def right(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []
        if current_tile.orientation == 0:
            for i in range(x-4, -1, -4):
                current_tile = board[i][y]
                if current_tile.type == TileType.PADDING:
                    break
                if not current_tile.is_empty():
                    if current_tile.piece.color != self.color :
                        valid_moves.append((i, y))
                    break
                valid_moves.append((i, y))
        elif current_tile.orientation == 1:
            a, b = x - 2, y + 3
            while a > 0 and b < (len(board[a])-1) and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a, b))
                a -= 2
                b += 3
            if a > 0 and b < (len(board[a])-1) and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color: 
                valid_moves.append((a, b))
        else:
            a, b = x - 2, y - 3
            while a > 0 and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a,b))
                a -= 2
                b -= 3
            if a > 0 and b > 0 and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color:
                valid_moves.append((a,b))
        return valid_moves
	
    def up(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []
        if current_tile.orientation == 0:
            b = y-1
            while board[x][b].is_empty() and (not (board[x][b].type == TileType.PADDING)):
                valid_moves.append((x,b))
                b -= 1
            if b > 0 and board[x][b] != TileType.PADDING and board[x][b].piece.color != self.color:
                valid_moves.append((x,b))
        elif current_tile.orientation == 1:
            a, b = x - 2, y - 1
            while a > 0 and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a,b))
                a -= 2
                b -= 1
            if a > 0 and b > 0 and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color:
                valid_moves.append((a,b))
        else:
            a, b = x + 2, y - 1
            while a < len(board) and b > 0 and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a,b))
                a += 2
                b -= 1
            if a < len(board) and b > 0 and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color:
                valid_moves.append((a,b))
        return valid_moves

    def down(self, x: int, y: int, board: list[list[ChessTile]]):
        current_tile = board[x][y]
        valid_moves = []
        if current_tile.orientation == 0:
            b = y+1
            while board[x][b].is_empty() and (not (board[x][b].type == TileType.PADDING)):
                valid_moves.append((x,b))
                b += 1
            if b < (len(board[x]) - 1) and board[x][b] != TileType.PADDING and board[x][b].piece.color != self.color:
                valid_moves.append((x,b))
        elif current_tile.orientation == 1:
            a, b = x + 2, y + 1
            while a < len(board) and b < (len(board[a]) - 1) and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a,b))
                a += 2
                b += 1
            if a < len(board) and b < (len(board[a]) - 1) and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color:
                valid_moves.append((a,b))
        else:
            a, b = x - 2, y + 1
            while a > 0 and (len(board[a]) - 1) and board[a][b].is_empty() and (not (board[a][b].type == TileType.PADDING)):
                valid_moves.append((a,b))
                a -= 2
                b += 1
            if a > 0 and b < (len(board[a]) - 1) and board[a][b] != TileType.PADDING and board[a][b].piece.color != self.color:
                valid_moves.append((a,b))
        return valid_moves
