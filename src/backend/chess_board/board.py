class chess_tile:
    def __init__(self, piece, color, orientation):
        self.piece = piece
        self.color = color
        self.orientation = orientation

    def get_piece(self):
        return self.piece
    
    def get_color(self):
        return self.color
    
    def get_orientation(self):
        return self.orientation
    
    def __str__(self):
        return f"Piece: {self.piece}, Color: {self.color}, Orientation: {self.orientation}"
    
class chess_board:
    def __init__(self):
        self.create_board()

        
    def create_board(self) -> None:
        # Create half the board columns then duplicate and reverse after adding the middle column
        board = [[] for _ in range(8)]
        color_list = [[0,1,2], [2,1,0], [1,2,0], [0,2,1], [2,0,1], [1,0,2], [0,1,2], [2,1,0]]
        min_diag = 6
        min_horiz = 12
        for i in range(8):
            if i % 2 == 0:
                board[i] = self.create_tile_column(color_list[i], min_diag, 1)
                min_diag += 1
            else:
                board[i] = (self.create_tile_column(color_list[i], min_horiz, 0))
                min_horiz += 2


        board = board + [self.create_tile_column([1,2,0], 10, 1)] + board[::-1]

        self.board = board

    def get_board(self):
        return self.board
    
    def create_tile_column(self, colors, size, orientation):
        """
        Assigns color to a column of tiles based on given pattern
        Args:
            colors (list): list of colors to assign to column
            size (int): size 
        """
        return[chess_tile("", colors[i % 3], orientation) for i in range(size)]
        


board = chess_board()
for i in board.get_board():
    print("New Column with size: ", len(i), "\n")
    for j in i:
        print(j)