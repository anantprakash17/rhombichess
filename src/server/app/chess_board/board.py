import copy

class ChessPiece:
    def __init__(self, name, color) -> None:
        """
        Initializes a chess piece
        Args:
            name (str): name of piece
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
        return f"{self.name}-{'black' if self.color == 0 else 'white'}"
    

    

class ChessTile:
    def __init__(self, piece, color, orientation) -> None:
        """
        Initializes a chess tile
        Args:
            piece (ChessPiece): piece on the tile
            color (int): color of the tile
            orientation (int): orientation of the tile
        """
        self.piece:ChessPiece = piece
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
        return (
            f"Piece: {self.piece}, Color: {self.color}, Orientation: {self.orientation}"
        )


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
        board = (
            board
            + [self.create_tile_column([1, 2, 0], 0, 1)]
            + copy.deepcopy(board[::-1])
        )

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
                if (not (tile.color == None)):
                    string_board[-1].append(tile.piece.get_piece() if tile.piece else "")
        return string_board

    def create_tile_column(
        self, colors: list[int], orientation: int, padding: int
    ) -> list[ChessTile]:
        """
        Assigns color to a column of tiles based on given pattern
        Args:
            colors (list): list of colors to assign to column
            size (int): size
            orientation (int): orientation of the column
        """
        chesspadding = [ChessTile(None, None, None)] * padding
        column = []
        flag = False
        color = 0
        if orientation == 0:
          for i in range(20-(padding*2)+1):
            if not flag:
              column.append(ChessTile(None, colors[color%3], 0))
              color += 1
            else:
              column.append(ChessTile(None, None, None))
            flag = not flag  
        else:
          column = [
              ChessTile(
                  None,
                  colors[i % 3],
                  (orientation * (-1) ** i) if orientation == 1 else orientation,
              )
              for i in range(20-(padding*2))
          ]
        return chesspadding + column + chesspadding

    def add_default_pieces(self) -> None:
        """
        Adds default pieces to the board
        """
        # This part is done manually, not sure if there is a better way to do it
        # Add soldiers
        self.board[0][5].piece = ChessPiece("soldier", 0)
        self.board[0][15].piece = ChessPiece("soldier", 1)

        self.board[16][5].piece = ChessPiece("soldier", 0)
        self.board[16][15].piece = ChessPiece("soldier", 1)

        self.board[4][5].piece = ChessPiece("soldier", 0)
        self.board[4][15].piece = ChessPiece("soldier", 1)

        self.board[8][5].piece = ChessPiece("soldier", 0)
        self.board[8][15].piece = ChessPiece("soldier", 1)

        self.board[12][5].piece = ChessPiece("soldier", 0)
        self.board[12][15].piece = ChessPiece("soldier", 1)

        # add pawns
        self.board[1][5].piece = ChessPiece("pawn", 0)
        self.board[1][14].piece = ChessPiece("pawn", 1)

        self.board[2][6].piece = ChessPiece("pawn", 0)
        self.board[2][14].piece = ChessPiece("pawn", 1)

        self.board[3][5].piece = ChessPiece("pawn", 0)
        self.board[3][14].piece = ChessPiece("pawn", 1)

        self.board[5][5].piece = ChessPiece("pawn", 0)
        self.board[5][14].piece = ChessPiece("pawn", 1)

        self.board[6][6].piece = ChessPiece("pawn", 0)
        self.board[6][14].piece = ChessPiece("pawn", 1)

        self.board[7][5].piece = ChessPiece("pawn", 0)
        self.board[7][14].piece = ChessPiece("pawn", 1)

        self.board[9][5].piece = ChessPiece("pawn", 0)
        self.board[9][14].piece = ChessPiece("pawn", 1)

        self.board[10][6].piece = ChessPiece("pawn", 0)
        self.board[10][14].piece = ChessPiece("pawn", 1)

        self.board[11][5].piece = ChessPiece("pawn", 0)
        self.board[11][14].piece = ChessPiece("pawn", 1)

        self.board[13][5].piece = ChessPiece("pawn", 0)
        self.board[13][14].piece = ChessPiece("pawn", 1)

        self.board[14][6].piece = ChessPiece("pawn", 0)
        self.board[14][14].piece = ChessPiece("pawn", 1)

        self.board[15][5].piece = ChessPiece("pawn", 0)
        self.board[15][14].piece = ChessPiece("pawn", 1)

        # add elephants
        self.board[2][4].piece = ChessPiece("elephant", 0)
        self.board[2][16].piece = ChessPiece("elephant", 1)

        self.board[13][3].piece = ChessPiece("elephant", 0)
        self.board[13][16].piece = ChessPiece("elephant", 1)

        self.board[15][4].piece = ChessPiece("elephant", 0)
        self.board[15][15].piece = ChessPiece("elephant", 1)

        # add cats
        self.board[5][4].piece = ChessPiece("cat", 0)
        self.board[5][15].piece = ChessPiece("cat", 1)

        self.board[8][3].piece = ChessPiece("cat", 0)
        self.board[8][17].piece = ChessPiece("cat", 1)

        self.board[11][4].piece = ChessPiece("cat", 0)
        self.board[11][15].piece = ChessPiece("cat", 1)

        # add jesters
        self.board[7][2].piece = ChessPiece("jester", 0)
        self.board[7][17].piece = ChessPiece("jester", 1)

        self.board[8][1].piece = ChessPiece("jester", 0)
        self.board[8][19].piece = ChessPiece("jester", 1)

        self.board[9][2].piece = ChessPiece("jester", 0)
        self.board[9][17].piece = ChessPiece("jester", 1)

        # add bishops
        self.board[1][4].piece = ChessPiece("bishop", 0)
        self.board[1][15].piece = ChessPiece("bishop", 1)

        self.board[14][4].piece = ChessPiece("bishop", 0)
        self.board[14][16].piece = ChessPiece("bishop", 1)

        self.board[3][3].piece = ChessPiece("bishop", 0)
        self.board[3][16].piece = ChessPiece("bishop", 1)

        # add shields
        self.board[5][3].piece = ChessPiece("shield", 0)
        self.board[5][16].piece = ChessPiece("shield", 1)

        self.board[10][4].piece = ChessPiece("shield", 0)
        self.board[10][16].piece = ChessPiece("shield", 1)

        self.board[13][4].piece = ChessPiece("shield", 0)
        self.board[13][15].piece = ChessPiece("shield", 1)

        # add knights
        self.board[7][4].piece = ChessPiece("knight", 0)
        self.board[7][15].piece = ChessPiece("knight", 1)

        self.board[9][4].piece = ChessPiece("knight", 0)
        self.board[9][15].piece = ChessPiece("knight", 1)

        # add rooks
        self.board[5][2].piece = ChessPiece("rook", 0)
        self.board[5][17].piece = ChessPiece("rook", 1)

        self.board[11][2].piece = ChessPiece("rook", 0)
        self.board[11][17].piece = ChessPiece("rook", 1)

        # add machines
        self.board[7][3].piece = ChessPiece("machine", 0)
        self.board[7][16].piece = ChessPiece("machine", 1)

        self.board[9][3].piece = ChessPiece("machine", 0)
        self.board[9][16].piece = ChessPiece("machine", 1)

        # add dogs
        self.board[3][4].piece = ChessPiece("dog", 0)
        self.board[3][15].piece = ChessPiece("dog", 1)

        self.board[11][3].piece = ChessPiece("dog", 0)
        self.board[11][16].piece = ChessPiece("dog", 1)

        self.board[6][4].piece = ChessPiece("dog", 0)
        self.board[6][16].piece = ChessPiece("dog", 1)

        # add princes
        self.board[4][3].piece = ChessPiece("prince", 0)
        self.board[4][17].piece = ChessPiece("prince", 1)

        self.board[12][3].piece = ChessPiece("prince", 0)
        self.board[12][17].piece = ChessPiece("prince", 1)

        # add mammoth
        self.board[10][2].piece = ChessPiece("mammoth", 0)
        self.board[10][18].piece = ChessPiece("mammoth", 1)

        # add hawk
        self.board[6][2].piece = ChessPiece("hawk", 0)
        self.board[6][18].piece = ChessPiece("hawk", 1)

        # add queen
        self.board[9][1].piece = ChessPiece("queen", 0)
        self.board[9][18].piece = ChessPiece("queen", 1)

        # add king
        self.board[7][1].piece = ChessPiece("king", 0)
        self.board[7][18].piece = ChessPiece("king", 1)

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


