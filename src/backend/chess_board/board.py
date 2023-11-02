class chess_tile:
    def __init__(self, piece, color, orientation) -> None:
        """
        Initializes a chess tile
        Args:
            piece (str): piece on the tile
            color (int): color of the tile
            orientation (int): orientation of the tile
        """
        self.piece = piece
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


class chess_board:
    def __init__(self):
        """
        Creates a chess board
        """
        self.create_board()

    def create_board(self) -> None:
        """
        Creates an empty chess board with 17 columns
        """
        # Create half the board columns then duplicate and reverse after adding the middle column
        board = [[] for _ in range(8)]
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
        for i in range(8):
            if i % 2 == 0:
                board[i] = self.create_tile_column(color_list[i], min_diag, 0)
                min_diag += 1
            else:
                board[i] = self.create_tile_column(color_list[i], min_horiz, 1)
                min_horiz += 2

        board = board + [self.create_tile_column([1, 2, 0], 10, 1)] + board[::-1]

        self.board = board

    def get_board(self) -> list[list[chess_tile]]:
        """
        Get the chess board
        Returns:
            list[list[chess_tile]]: chess board
        """
        return self.board

    def create_tile_column(
        self, colors: list[int], size: int, orientation: int
    ) -> list[chess_tile]:
        """
        Assigns color to a column of tiles based on given pattern
        Args:
            colors (list): list of colors to assign to column
            size (int): size
            orientation (int): orientation of the column
        """
        return [
            chess_tile(
                "",
                colors[i % 3],
                (orientation * (-1) ** i) if orientation == 1 else orientation,
            )
            for i in range(size)
        ]
    
    def move_piece(self, start: tuple[int, int], end: tuple[int, int]) -> None:
        """
        Moves a piece from start to end
        Args:
            start (tuple): starting position
            end (tuple): ending position
        """
        self.board[end[0]][end[1]].piece = self.board[start[0]][start[1]].piece
        self.board[start[0]][start[1]].piece = ""


board = chess_board()
for i in board.get_board():
    print("New Column with size: ", len(i), "\n")
    for j in i:
        print(j)
