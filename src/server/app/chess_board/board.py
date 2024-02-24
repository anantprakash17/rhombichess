import copy
from math import pi
from operator import indexOf
from chess_pieces import PieceType


class ChessPiece:
    def __init__(self, name: PieceType, color: int) -> None:
        """
        Initializes a chess piece
        Args:
            name (PieceType): name of piece
            color (int): color of the piece
        """
        self.name = name
        self.color = color

    def get_piece(self) -> str:
        """
        Get the name and color of the piece
        Returns:
            str: {name}-{color}
        """
        return f"{self.name.value}-{'black' if self.color == 0 else 'white'}"


class ChessTile:
    def __init__(self, piece, color, orientation) -> None:
        """
        Initializes a chess tile
        Args:
            piece (ChessPiece): piece on the tile
            color (int): color of the tile
            orientation (int): orientation of the tile
        """
        self.piece: ChessPiece = piece
        self.color = color
        self.orientation = orientation

    def get_piece(self) -> str:
        """
        Get the piece on the tile
        Returns:
            str: piece on the tile
        """
        return self.piece

    def get_color(self) -> int:
        """
        Get the color of the tile
        Returns:
            int: color of the tile
        """
        return self.color

    def get_orientation(self) -> int:
        """
        Get the orientation of the tile
        Returns:
            int: orientation of the tile
        """
        return self.orientation

    def __str__(self):
        return f"Piece: {self.piece}, Color: {self.color}, Orientation: {self.orientation}"

    def __repr__(self) -> str:
        if not self.piece:
            return "bl"
        if self.piece.name == PieceType.DIAMOND:
            return "di"
        if self.piece.name == PieceType.PADDING:
            return "pa"
        return f"Piece: {self.piece.get_piece()}"


class ChessBoard:
    def __init__(self):
        """
        Creates a chess board
        """
        self.create_board()
        self.add_default_pieces()

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

        self.board = board

    def get_board(self) -> list[list[ChessTile]]:
        """
        Get the chess board
        Returns:
            list[list[chess_tile]]: chess board
        """
        return self.board

    def get_piece_locations(self) -> list[list[str]]:
        """
        Get the chess board
        Returns:
            list[list[chess_tile]]: chess board
        """
        string_board = []
        for column in self.board:
            string_board.append([])
            for tile in column:
                if (tile.piece and not tile.piece.color == None) or not tile.piece:
                    if not tile.piece:
                        string_board[-1].append("")
                        continue
                    piece = tile.piece.get_piece()
                    string_board[-1].append(piece)
        return string_board

    def create_tile_column(self, colors: list[int], orientation: int, padding: int) -> list[ChessTile]:
        """
        Assigns color to a column of tiles based on given pattern
        Args:
            colors (list): list of colors to assign to column
            size (int): size
            orientation (int): orientation of the column
        """
        chesspadding = [ChessTile(ChessPiece(PieceType.PADDING, None), None, None) for _ in range(padding)]
        column = []
        flag = False
        color = 0
        if orientation == 0:
            for _ in range(20 - (padding * 2)):
                if not flag:
                    column.append(ChessTile(None, colors[color % 3], 0))
                    color += 1
                else:
                    column.append(ChessTile(ChessPiece(PieceType.DIAMOND, None), None, None))
                flag = not flag
            column = (
                copy.deepcopy(chesspadding[:-1])
                + [ChessTile(ChessPiece(PieceType.DIAMOND, None), None, None)]
                + column
                + copy.deepcopy(chesspadding)
            )
        else:
            column = [
                ChessTile(
                    None,
                    colors[i % 3],
                    (orientation * (-1) ** i) if orientation == 1 else orientation,
                )
                for i in range(20 - (padding * 2))
            ]
            column = copy.deepcopy(chesspadding) + column + copy.deepcopy(chesspadding)
        return column + ([ChessTile(ChessPiece(PieceType.PADDING, None), None, None)] if padding != 0 else [])

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
        self.board[5][2].piece = ChessPiece(PieceType.ROOK, 0)
        self.board[5][17].piece = ChessPiece(PieceType.ROOK, 1)

        self.board[11][2].piece = ChessPiece(PieceType.ROOK, 0)
        self.board[11][17].piece = ChessPiece(PieceType.ROOK, 1)

        # add machines
        self.board[7][3].piece = ChessPiece(PieceType.MACHINE, 0)
        self.board[7][16].piece = ChessPiece(PieceType.MACHINE, 1)

        self.board[9][3].piece = ChessPiece(PieceType.MACHINE, 0)
        self.board[9][16].piece = ChessPiece(PieceType.MACHINE, 1)

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

    def move_piece(self, start: tuple[int, int], end: tuple[int, int]) -> None:
        """
        Moves a piece from start to end
        Args:
            start (tuple): starting position
            end (tuple): ending position
        """
        # check to make sure there is no piece at the end
        if self.board[end[0]][end[1]].piece:
            return
        self.board[end[0]][end[1]].piece = self.board[start[0]][start[1]].piece
        self.board[start[0]][start[1]].piece = ""
