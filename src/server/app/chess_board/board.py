import copy

from app.chess_board.chess_objects import ChessPiece, ChessTile, PieceType, TileType
from app.chess_board.chess_pieces import *


class ChessBoard:

    PIECE_CLASSES = {
        PieceType.KING: King,
        PieceType.QUEEN: Queen,
        PieceType.PAWN: Pawn,
        PieceType.ROOK: Rook,
        PieceType.BISHOP: Bishop,
        PieceType.MACHINE: Machine,
        PieceType.KNIGHT: Knight,
        PieceType.SHIELD: Shield,
        PieceType.JESTER: Jester,
        PieceType.CAT: Cat,
        PieceType.ELEPHANT: Elephant,
        PieceType.SOLDIER: Soldier,
        PieceType.PRINCE: Prince,
        PieceType.DOG: Dog,
        PieceType.MAMMOTH: Mammoth,
        PieceType.HAWK: Hawk,
    }

    COLUMN_MAP = {i: chr(81 - i) for i in range(17)}

    def __init__(self):
        """
        Creates a chess board
        """
        self.create_board()
        self.add_default_pieces()
        self.valid_moves: dict[tuple[int, int], list[tuple[int, int]]] = {}
        self.update_valid_moves()
        self.captured_pieces = {"black": [], "white": []}
        self.game_over = False
        self.checkmate = False
        self.in_check = (False, False)
        self.king_loc = {0: (7, 1), 1: (7, 18)}
        self.promotion = False
        self.promotion_loc = None
        self.sim_game = False
        self.move_stack = []

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
        board[8][0] = ChessTile(None, None, None, TileType.PADDING)
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

    def get_piece_locations(self) -> dict[tuple[int, int], dict[str, str]]:
        """
        Get the chess board as a dictionary of piece locations
        Returns:
            dict[tuple[int,int], dict[str, str]]: chess board
        """
        dict_board = {}
        for x in range(len(self.board)):
            for y in range(len(self.board[x])):
                tile = self.board[x][y]
                dict_board[str((x, y))] = {
                    "piece": f"{tile.piece.get_piece()}" if tile.piece else "",
                    "type": f"{tile.type.name}",
                }
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
                    column.append(ChessTile(None, None, 0, TileType.DIAMOND))
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
        self.board[0][5].piece = Soldier(0)
        self.board[0][15].piece = Soldier(1)

        self.board[16][5].piece = Soldier(0)
        self.board[16][15].piece = Soldier(1)

        self.board[4][5].piece = Soldier(0)
        self.board[4][15].piece = Soldier(1)

        self.board[8][5].piece = Soldier(0)
        self.board[8][15].piece = Soldier(1)

        self.board[12][5].piece = Soldier(0)
        self.board[12][15].piece = Soldier(1)

        # add pawns
        self.board[1][5].piece = Pawn(0)
        self.board[1][14].piece = Pawn(1)

        self.board[2][6].piece = Pawn(0)
        self.board[2][14].piece = Pawn(1)

        self.board[3][5].piece = Pawn(0)
        self.board[3][14].piece = Pawn(1)

        self.board[5][5].piece = Pawn(0)
        self.board[5][14].piece = Pawn(1)

        self.board[6][6].piece = Pawn(0)
        self.board[6][14].piece = Pawn(1)

        self.board[7][5].piece = Pawn(0)
        self.board[7][14].piece = Pawn(1)

        self.board[9][5].piece = Pawn(0)
        self.board[9][14].piece = Pawn(1)

        self.board[10][6].piece = Pawn(0)
        self.board[10][14].piece = Pawn(1)

        self.board[11][5].piece = Pawn(0)
        self.board[11][14].piece = Pawn(1)

        self.board[13][5].piece = Pawn(0)
        self.board[13][14].piece = Pawn(1)

        self.board[14][6].piece = Pawn(0)
        self.board[14][14].piece = Pawn(1)

        self.board[15][5].piece = Pawn(0)
        self.board[15][14].piece = Pawn(1)

        # add elephants
        self.board[2][4].piece = Elephant(0)
        self.board[2][16].piece = Elephant(1)

        self.board[13][3].piece = Elephant(0)
        self.board[13][16].piece = Elephant(1)

        self.board[15][4].piece = Elephant(0)
        self.board[15][15].piece = Elephant(1)

        # add cats
        self.board[5][4].piece = Cat(0)
        self.board[5][15].piece = Cat(1)

        self.board[8][3].piece = Cat(0)
        self.board[8][17].piece = Cat(1)

        self.board[11][4].piece = Cat(0)
        self.board[11][15].piece = Cat(1)

        # add jesters
        self.board[7][2].piece = Jester(0)
        self.board[7][17].piece = Jester(1)

        self.board[8][1].piece = Jester(0)
        self.board[8][19].piece = Jester(1)

        self.board[9][2].piece = Jester(0)
        self.board[9][17].piece = Jester(1)

        # add bishops
        self.board[1][4].piece = Bishop(0)
        self.board[1][15].piece = Bishop(1)

        self.board[14][4].piece = Bishop(0)
        self.board[14][16].piece = Bishop(1)

        self.board[3][3].piece = Bishop(0)
        self.board[3][16].piece = Bishop(1)

        # add shields
        self.board[5][3].piece = Shield(0)
        self.board[5][16].piece = Shield(1)

        self.board[10][4].piece = Shield(0)
        self.board[10][16].piece = Shield(1)

        self.board[13][4].piece = Shield(0)
        self.board[13][15].piece = Shield(1)

        # add knights
        self.board[7][4].piece = Knight(0)
        self.board[7][15].piece = Knight(1)

        self.board[9][4].piece = Knight(0)
        self.board[9][15].piece = Knight(1)

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
        self.board[3][4].piece = Dog(0)
        self.board[3][15].piece = Dog(1)

        self.board[11][3].piece = Dog(0)
        self.board[11][16].piece = Dog(1)

        self.board[6][4].piece = Dog(0)
        self.board[6][16].piece = Dog(1)

        # add princes
        self.board[4][3].piece = Prince(0)
        self.board[4][17].piece = Prince(1)

        self.board[12][3].piece = Prince(0)
        self.board[12][17].piece = Prince(1)

        # add mammoth
        self.board[10][2].piece = Mammoth(0)
        self.board[10][18].piece = Mammoth(1)

        # add hawk
        self.board[6][2].piece = Hawk(0)
        self.board[6][18].piece = Hawk(1)

        # add queen
        self.board[9][1].piece = Queen(0)
        self.board[9][18].piece = Queen(1)

        # add king
        self.board[7][1].piece = King(0)
        self.board[7][18].piece = King(1)

    def move_piece(self, start: tuple[int, int], end: tuple[int, int]) -> bool:
        """
        Moves a piece from start to end
        Args:
            start (tuple): starting position
            end (tuple): ending position
        """

        # ensure the move is valid
        piece_moves = self.valid_moves.get(start)
        if piece_moves is None or end not in piece_moves:
            return False

        # Check for capture
        end_tile = self.board[end[0]][end[1]]
        start_tile = self.board[start[0]][start[1]]

        captured_piece = None
        # Check if king captured
        if not end_tile.is_empty():
            if "king" in end_tile.piece.get_piece():
                self.game_over = True
            self.captured_pieces["black" if end_tile.piece.color == 0 else "white"].append(end_tile.piece.get_piece())
            captured_piece = end_tile.piece.get_piece()

        # Check if king is being moved
        if "king" in start_tile.piece.get_piece():
            self.king_loc[start_tile.piece.color] = end

        # Check for promotion
        if any(piece in start_tile.piece.get_piece() for piece in ["soldier", "pawn"]) and self.check_promotion(end):
            self.promotion_loc = end
            self.promotion = True

        end_tile.piece = start_tile.piece
        start_tile.piece = None

        color = 1 if end_tile.piece.color == 0 else 0
        self.update_game_state(color)

        move_info = {
            "piece": end_tile.piece.get_piece(),
            "start": f"{self.COLUMN_MAP[start[0]]}{start[1]}",
            "end": f"{self.COLUMN_MAP[end[0]]}{end[1]}",
            "piece_affected": captured_piece,
            "piece_promoted": False,
            "check": any(self.in_check),
        }
        self.move_stack.append(move_info)

        return True

    def update_valid_moves(self, test_move=False) -> None | dict[tuple[int, int], list[tuple[int, int]]]:
        """
        Update the valid moves for each piece on the board.
        """
        valid_moves = {}

        for x in range(len(self.board)):
            for y in range(len(self.board[x])):
                tile = self.board[x][y]
                if not tile.is_empty() and tile.piece:
                    valid_moves[(x, y)] = tile.piece.calculate_valid_moves((x, y), self.board)

        if test_move:
            return valid_moves
        else:
            self.valid_moves = valid_moves

    def king_check(self, color: int, test_moveset=None) -> bool:
        """
        Check if the king of the given color is in check
        Args:
            color (int): color of the king
        Returns:
            bool: True if the king is in check, False otherwise
        """
        if test_moveset is None:
            test_moveset = self.valid_moves

        for k, v in test_moveset.items():
            if v is None:
                continue
            for move in v:
                if move == self.king_loc[color] and self.board[k[0]][k[1]].piece.color != color:
                    return True
        return False

    def promote(self, piece: str) -> None:
        """
        Promotes a pawn to the given piece
        Args:
            piece (str): piece to promote to
        """
        if not self.promotion:
            return False

        piece_type = PieceType(piece.lower())
        promotion_tile = self.board[self.promotion_loc[0]][self.promotion_loc[1]]
        promotion_piece = promotion_tile.piece
        promotion_tile.piece = self.PIECE_CLASSES[piece_type](promotion_piece.color)
        self.update_game_state(1 if promotion_piece.color == 0 else 0)
        move_info = {
            "piece": promotion_piece.get_piece(),
            "start": f"{self.COLUMN_MAP[self.promotion_loc[0]]}{self.promotion_loc[1]}",
            "end": f"{self.COLUMN_MAP[self.promotion_loc[0]]}{self.promotion_loc[1]}",
            "piece_affected": promotion_tile.piece.get_piece(),
            "piece_promoted": True,
            "check": any(self.in_check),
        }
        self.move_stack.append(move_info)
        self.promotion = False
        self.promotion_loc = None
        return True

    def check_promotion(self, coords: tuple[int, int]) -> bool:
        """
        Check if a pawn or solder can be promoted
        """
        tile = self.board[coords[0]][coords[1]]
        return coords[1] >= (15 if tile.orientation != 0 else 16) or coords[1] <= 4

    def filter_dangerous_moves(self, color: int) -> None:
        new_valid_moves = {}
        for k, v in self.valid_moves.items():
            piece = self.board[k[0]][k[1]].piece
            if v is None or piece.color != color:
                continue
            new_valid_moves[k] = []
            tried_moves = set()
            for move in v:
                if move in tried_moves:
                    continue
                tried_moves.add(move)

                if self.board[move[0]][move[1]].type == TileType.PADDING:
                    continue

                capture = self.board[move[0]][move[1]].piece
                self.board[move[0]][move[1]].piece = self.board[k[0]][k[1]].piece
                self.board[k[0]][k[1]].piece = None

                # update king location if king is moved
                if "king" in piece.get_piece():
                    self.king_loc[color] = move

                test_moveset = self.update_valid_moves(test_move=True)

                if not self.king_check(color, test_moveset):
                    new_valid_moves[k].append(move)

                # set king location back to original
                if "king" in piece.get_piece():
                    self.king_loc[color] = k

                # set valid moves back to original
                self.board[k[0]][k[1]].piece = self.board[move[0]][move[1]].piece
                self.board[move[0]][move[1]].piece = capture

        checkmate = True
        for k, v in new_valid_moves.items():
            if v:
                checkmate = False
            self.valid_moves[k] = v
        return not checkmate

    def update_game_state(self, color) -> None:
        """
        Updates the game state
        Args:
            color (int): color of the player
        """
        self.update_valid_moves()
        self.in_check = (self.king_check(0), self.king_check(1))
        if not self.filter_dangerous_moves(color):
            self.checkmate = True
            self.game_over = True
