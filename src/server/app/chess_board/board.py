import copy

from chess_objects import ChessPiece, ChessTile, PieceType, TileType
from chess_pieces import Machine, Rook

class ChessBoard:
    def __init__(self):
        """
        Creates a chess board
        """
        self.create_board()
        self.add_default_pieces()
        self.valid_moves = {}
        self.update_valid_moves(0)
        self.update_valid_moves(1)

    def create_board(self) -> None:
        """
        Creates an empty chess board with 17 columns
        """
        # Create half the board columns then duplicate and reverse after adding the middle column
        board: list[list[ChessTile]] = [[] for _ in range(8)]
        color_list = [
            [0, 1, 2],
            [2, 1, 0],
            [1, 2, 0],
            [0, 2, 1],
            [2, 0, 1],
            [1, 0, 2],
            [0, 1, 2],
            [2, 1, 0],
        ]
        min_diag = 6
        min_horiz = 12
        padding = 5
        for i in range(8):
            if i % 2 == 0:
                board[i] = self.create_tile_column(color_list[i], 0, padding)
                min_diag += 1
                padding -= 1
            else:
                board[i] = self.create_tile_column(color_list[i], 1, padding)
                min_horiz += 2
        board = board + [self.create_tile_column([1, 2, 0], 0, 0)] + copy.deepcopy(board[::-1])
        board[8].append(ChessTile(None, None, None, TileType.PADDING))

        # Flip the orientation of the tiles after the middle column
        for i in range(9, 17):
            for j in range(len(board[i])):
                tile = board[i][j]
                if tile.orientation in [-1, 1]:
                    tile.orientation = -1 if tile.orientation == 1 else 1

        self.board = board

    def get_board(self) -> list[list[ChessTile]]:
        """
        Get the chess board
        Returns:
            list[list[chess_tile]]: chess board
        """
        return self.board

    def print_board(self) -> None:
        """
        Print the chess board
        """
        # use get_piece_locations to get the board as a list of strings
        board = self.get_piece_locations()
        for row in board:
            print(" ".join(row))
        return self.board

    def get_piece_locations(self) -> dict[tuple[int,int], dict[str, str]]:
        """
        Get the chess board as a dictionary of piece locations
        Returns:
            dict[tuple[int,int], dict[str, str]]: chess board
        """
        dict_board = {}
        for x in range(len(self.board)):
            for y in range(len(self.board[x])):
                tile = self.board[x][y]
                dict_board[str((x, y))] = {"piece": f"{tile.piece.get_piece()}" if tile.piece else "", "type": f"{tile.type.name}"}
        return dict_board
            

    def create_tile_column(self, colors: list[int], orientation: int, padding: int) -> list[ChessTile]:
        """
        Assigns color to a column of tiles based on given pattern
        Args:
            colors (list): list of colors to assign to column
            size (int): size
            orientation (int): orientation of the column
            padding (int): padding to add to the column
        """
        column = []
        flag = True
        color = 0
        if orientation == 0:
            padding -= 1 if padding >= 1 else 0
            chesspadding = [ChessTile(None, None, None, TileType.PADDING) for _ in range(padding)]
            for _ in range(20 - (padding * 2)):
                if not flag:
                    column.append(ChessTile(None, colors[color % 3], 0, TileType.NORMAL))
                    color += 1
                else:
                    column.append(ChessTile(None, None, None, TileType.DIAMOND))
                flag = not flag
            column = copy.deepcopy(chesspadding) + column + copy.deepcopy(chesspadding)
        else:
            chesspadding = [ChessTile(None, None, None, TileType.PADDING) for _ in range(padding)]
            column = [
                ChessTile(
                    None,
                    colors[i % 3],
                    (orientation * (-1) ** i) if orientation == 1 else orientation,
                    TileType.NORMAL,
                )
                for i in range(20 - (padding * 2))
            ]
            column = copy.deepcopy(chesspadding) + column + copy.deepcopy(chesspadding)
        return column + ([ChessTile(None, None, None, TileType.PADDING)] if padding != 0 else [])

    def add_default_pieces(self) -> None:
        """
        Adds default pieces to the board
        """
        # This part is done manually, not sure if there is a better way to do it
        # Add soldiers
        self.board[0][5].piece = ChessPiece(PieceType.SOLDIER, 0)
        self.board[0][15].piece = ChessPiece(PieceType.SOLDIER, 1)

        self.board[16][5].piece = ChessPiece(PieceType.SOLDIER, 0)
        self.board[16][15].piece = ChessPiece(PieceType.SOLDIER, 1)

        self.board[4][5].piece = ChessPiece(PieceType.SOLDIER, 0)
        self.board[4][15].piece = ChessPiece(PieceType.SOLDIER, 1)

        self.board[8][5].piece = ChessPiece(PieceType.SOLDIER, 0)
        self.board[8][15].piece = ChessPiece(PieceType.SOLDIER, 1)

        self.board[12][5].piece = ChessPiece(PieceType.SOLDIER, 0)
        self.board[12][15].piece = ChessPiece(PieceType.SOLDIER, 1)

        # add pawns
        self.board[1][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[1][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[2][6].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[2][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[3][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[3][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[5][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[5][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[6][6].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[6][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[7][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[7][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[9][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[9][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[10][6].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[10][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[11][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[11][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[13][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[13][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[14][6].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[14][14].piece = ChessPiece(PieceType.PAWN, 1)

        self.board[15][5].piece = ChessPiece(PieceType.PAWN, 0)
        self.board[15][14].piece = ChessPiece(PieceType.PAWN, 1)

        # add elephants
        self.board[2][4].piece = ChessPiece(PieceType.ELEPHANT, 0)
        self.board[2][16].piece = ChessPiece(PieceType.ELEPHANT, 1)

        self.board[13][3].piece = ChessPiece(PieceType.ELEPHANT, 0)
        self.board[13][16].piece = ChessPiece(PieceType.ELEPHANT, 1)

        self.board[15][4].piece = ChessPiece(PieceType.ELEPHANT, 0)
        self.board[15][15].piece = ChessPiece(PieceType.ELEPHANT, 1)

        # add cats
        self.board[5][4].piece = ChessPiece(PieceType.CAT, 0)
        self.board[5][15].piece = ChessPiece(PieceType.CAT, 1)

        self.board[8][3].piece = ChessPiece(PieceType.CAT, 0)
        self.board[8][17].piece = ChessPiece(PieceType.CAT, 1)

        self.board[11][4].piece = ChessPiece(PieceType.CAT, 0)
        self.board[11][15].piece = ChessPiece(PieceType.CAT, 1)

        # add jesters
        self.board[7][2].piece = ChessPiece(PieceType.JESTER, 0)
        self.board[7][17].piece = ChessPiece(PieceType.JESTER, 1)

        self.board[8][1].piece = ChessPiece(PieceType.JESTER, 0)
        self.board[8][19].piece = ChessPiece(PieceType.JESTER, 1)

        self.board[9][2].piece = ChessPiece(PieceType.JESTER, 0)
        self.board[9][17].piece = ChessPiece(PieceType.JESTER, 1)

        # add bishops
        self.board[1][4].piece = ChessPiece(PieceType.BISHOP, 0)
        self.board[1][15].piece = ChessPiece(PieceType.BISHOP, 1)

        self.board[14][4].piece = ChessPiece(PieceType.BISHOP, 0)
        self.board[14][16].piece = ChessPiece(PieceType.BISHOP, 1)

        self.board[3][3].piece = ChessPiece(PieceType.BISHOP, 0)
        self.board[3][16].piece = ChessPiece(PieceType.BISHOP, 1)

        # add shields
        self.board[5][3].piece = ChessPiece(PieceType.SHIELD, 0)
        self.board[5][16].piece = ChessPiece(PieceType.SHIELD, 1)

        self.board[10][4].piece = ChessPiece(PieceType.SHIELD, 0)
        self.board[10][16].piece = ChessPiece(PieceType.SHIELD, 1)

        self.board[13][4].piece = ChessPiece(PieceType.SHIELD, 0)
        self.board[13][15].piece = ChessPiece(PieceType.SHIELD, 1)

        # add knights
        self.board[7][4].piece = ChessPiece(PieceType.KNIGHT, 0)
        self.board[7][15].piece = ChessPiece(PieceType.KNIGHT, 1)

        self.board[9][4].piece = ChessPiece(PieceType.KNIGHT, 0)
        self.board[9][15].piece = ChessPiece(PieceType.KNIGHT, 1)

        # add rooks
        self.board[5][2].piece = Rook(0)
        self.board[5][17].piece = Rook(1)

        self.board[11][2].piece = Rook(0)
        self.board[11][17].piece = Rook(1)

        # add machines
        self.board[7][3].piece = Machine(0)
        self.board[7][16].piece = Machine(1)

        self.board[9][3].piece = Machine(0)
        self.board[9][16].piece = Machine(1)

        # add dogs
        self.board[3][4].piece = ChessPiece(PieceType.DOG, 0)
        self.board[3][15].piece = ChessPiece(PieceType.DOG, 1)

        self.board[11][3].piece = ChessPiece(PieceType.DOG, 0)
        self.board[11][16].piece = ChessPiece(PieceType.DOG, 1)

        self.board[6][4].piece = ChessPiece(PieceType.DOG, 0)
        self.board[6][16].piece = ChessPiece(PieceType.DOG, 1)

        # add princes
        self.board[4][3].piece = ChessPiece(PieceType.PRINCE, 0)
        self.board[4][17].piece = ChessPiece(PieceType.PRINCE, 1)

        self.board[12][3].piece = ChessPiece(PieceType.PRINCE, 0)
        self.board[12][17].piece = ChessPiece(PieceType.PRINCE, 1)

        # add mammoth
        self.board[10][2].piece = ChessPiece(PieceType.MAMMOTH, 0)
        self.board[10][18].piece = ChessPiece(PieceType.MAMMOTH, 1)

        # add hawk
        self.board[6][2].piece = ChessPiece(PieceType.HAWK, 0)
        self.board[6][18].piece = ChessPiece(PieceType.HAWK, 1)

        # add queen
        self.board[9][1].piece = ChessPiece(PieceType.QUEEN, 0)
        self.board[9][18].piece = ChessPiece(PieceType.QUEEN, 1)

        # add king
        self.board[7][1].piece = ChessPiece(PieceType.KING, 0)
        self.board[7][18].piece = ChessPiece(PieceType.KING, 1)

    def move_piece(self, start: tuple[int, int], end: tuple[int, int]) -> bool:
        """
        Moves a piece from start to end
        Args:
            start (tuple): starting position
            end (tuple): ending position
        """

        # ensure the move is valid
        # piece_moves = self.valid_moves.get(start)
        # if piece_moves is None or end not in piece_moves:
        #     return False

        self.board[end[0]][end[1]].piece = self.board[start[0]][start[1]].piece
        self.board[start[0]][start[1]].piece = None

        color = self.board[end[0]][end[1]].piece.color

        self.update_valid_moves(color)
        return True

    def update_valid_moves(self, color: int):
        """
        Update the valid moves for each piece on the board.
        """
        self.valid_moves.clear()  # Clear the current valid moves
        for x in range(len(self.board)):
            for y in range(len(self.board[x])):
                tile = self.board[x][y]
                if not tile.is_empty() and tile.piece:
                    self.valid_moves[(x, y)] = tile.piece.calculate_valid_moves((x, y), self.board)


x = ChessBoard()

print(x.get_board()[1][7])
