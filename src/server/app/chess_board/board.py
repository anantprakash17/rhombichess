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
        Adds the default pieces to the board
        """
        piece_positions = {
            Soldier: [(0, 5), (0, 15), (16, 5), (16, 15), (4, 5), (4, 15), (8, 5), (8, 15), (12, 5), (12, 15)],
            Pawn: [
                (1, 5),
                (1, 14),
                (2, 6),
                (2, 14),
                (3, 5),
                (3, 14),
                (5, 5),
                (5, 14),
                (6, 6),
                (6, 14),
                (7, 5),
                (7, 14),
                (9, 5),
                (9, 14),
                (10, 6),
                (10, 14),
                (11, 5),
                (11, 14),
                (13, 5),
                (13, 14),
                (14, 6),
                (14, 14),
                (15, 5),
                (15, 14),
            ],
            Elephant: [(2, 4), (2, 16), (13, 3), (13, 16), (15, 4), (15, 15)],
            Cat: [(5, 4), (5, 15), (8, 3), (8, 17), (11, 4), (11, 15)],
            Jester: [(7, 2), (7, 17), (8, 1), (8, 19), (9, 2), (9, 17)],
            Bishop: [(1, 4), (1, 15), (14, 4), (14, 16), (3, 3), (3, 16)],
            Shield: [(5, 3), (5, 16), (10, 4), (10, 16), (13, 4), (13, 15)],
            Knight: [(7, 4), (7, 15), (9, 4), (9, 15)],
            Rook: [(5, 2), (5, 17), (11, 2), (11, 17)],
            Machine: [(7, 3), (7, 16), (9, 3), (9, 16)],
            Dog: [(3, 4), (3, 15), (11, 3), (11, 16)],
            Prince: [(4, 3), (4, 17), (12, 3), (12, 17)],
            Mammoth: [(10, 2), (10, 18)],
            Hawk: [(6, 2), (6, 18)],
            Queen: [(9, 1), (9, 18)],
            King: [(7, 1), (7, 18)],
        }

        for piece, positions in piece_positions.items():
            for i, position in enumerate(positions):
                self.board[position[0]][position[1]].piece = piece(i % 2)

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

        end_tile = self.board[end[0]][end[1]]
        start_tile = self.board[start[0]][start[1]]

        self.handle_capture(end_tile)
        self.handle_king_movement(start_tile, end)
        self.handle_promotion(start_tile, end)

        end_tile.piece = start_tile.piece
        start_tile.piece = None

        self.update_valid_moves()
        self.in_check = (self.king_check(0), self.king_check(1))

        color = 1 if end_tile.piece.color == 0 else 0

        if not self.filter_dangerous_moves(color):
            self.checkmate = True
            self.game_over = True

        return True

    def handle_capture(self, end_tile: ChessTile):
        """
        Handles the capture of a piece
        Args:
            end_tile (ChessTile): tile to check for capture
        """
        if not end_tile.is_empty():
            if "king" in end_tile.piece.get_piece():
                self.game_over = True
            color = "black" if end_tile.piece.color == 0 else "white"
            self.captured_pieces[color].append(end_tile.piece.get_piece())

    def handle_king_movement(self, start_tile: ChessTile, end: tuple[int, int]):
        """
        Updates the king location if the king is moved
        Args:
            start_tile (ChessTile): starting tile
            end (tuple): ending position
        """
        if "king" in start_tile.piece.get_piece():
            self.king_loc[start_tile.piece.color] = end

    def handle_promotion(self, start_tile: ChessTile, end: tuple[int, int]):
        """
        Checks if a pawn or soldier can be promoted
        Args:
            start_tile (ChessTile): starting tile
            end (tuple): ending position
        """
        if any(piece in start_tile.piece.get_piece() for piece in ["soldier", "pawn"]) and self.check_promotion(end):
            self.promotion_loc = end
            self.promotion = True

    def update_valid_moves(self, test_move=False) -> None | dict[tuple[int, int], list[tuple[int, int]]]:
        """
        Update the valid moves for each piece on the board.
        """
        valid_moves = {}

        for x, row in enumerate(self.board):
            for y, tile in enumerate(row):
                if tile.piece:
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

        return any(
            self.king_loc[color] in v and self.board[k[0]][k[1]].piece.color != color for k, v in test_moveset.items()
        )

    def promote(self, piece: str) -> bool:
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

        self.promotion = False
        self.promotion_loc = None

        return True

    def check_promotion(self, coords: tuple[int, int]) -> bool:
        """
        Check if a pawn or solder can be promoted
        Args:
            coords (tuple): coordinates of the piece
        """
        tile = self.board[coords[0]][coords[1]]
        return coords[1] >= (15 if tile.orientation != 0 else 16) or coords[1] <= 4

    def filter_dangerous_moves(self, color: int) -> None:
        new_valid_moves = {}
        for start, locations in self.valid_moves.items():
            start_tile = self.board[start[0]][start[1]]
            piece = start_tile.piece

            # skip if no valid moves or piece is not the same color
            if locations is None or piece.color != color:
                continue

            new_valid_moves[start] = []

            for move in locations:
                end_tile = self.board[move[0]][move[1]]

                if end_tile.type == TileType.PADDING:
                    continue

                # simulate move
                capture = end_tile.piece
                end_tile.piece = start_tile.piece
                start_tile.piece = None

                # update king location if king is moved
                if "king" in piece.get_piece():
                    self.king_loc[color] = move

                test_moveset = self.update_valid_moves(test_move=True)

                if not self.king_check(color, test_moveset):
                    new_valid_moves[start].append(move)

                # set king location back to original
                if "king" in piece.get_piece():
                    self.king_loc[color] = start

                # undo move
                start_tile.piece = end_tile.piece
                end_tile.piece = capture

        checkmate = True
        for start, locations in new_valid_moves.items():
            if locations:
                checkmate = False
            self.valid_moves[start] = locations
        return not checkmate
