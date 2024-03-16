import pytest
from app.chess_board.chess_objects import ChessPiece, ChessTile, PieceType, TileType
from app.chess_board.chess_pieces import *
from app.chess_board.board import *

#add soldiers once logic has been implemented
original_board = ChessBoard()

def test_king():
    #Initial board state move availability check for all pieces
    assert original_board.valid_moves[(7,1)] == []
    assert original_board.valid_moves[(7,18)] == []

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = King(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(8,9)].sort() == [(8, 7), (8, 11), (9, 7), (7, 7), (9, 8), (7, 8), (9, 9), (7, 9), (7, 10), (9, 10)].sort()
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = King(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(9,8)].sort() == [(9, 7), (10, 10), (8, 7), (7, 7), (11, 8), (10, 8), (7, 8), (11, 9), (9, 9), (8, 9)].sort()
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = King(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(7,8)].sort() == [(7, 7), (8, 9), (8, 7), (9, 8), (9, 7), (7, 9), (6, 10), (6, 8), (5, 8), (5, 9)].sort()
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    assert modified_board.valid_moves[(7,8)].sort() == [(7, 7), (8, 9), (8, 7), (9, 8), (9, 7), (7, 9), (6, 10), (6, 8), (5, 8), (5, 9)].sort()


  
def test_pawns():
    #Initial board state move availability check for some pieces
    assert original_board.valid_moves[(1,5)].sort() == [(1, 6), (1, 7)].sort()
    assert original_board.valid_moves[(2,14)] == [(2, 12)]
    assert original_board.valid_moves[(6,6)] == [(6, 8)]
    assert original_board.valid_moves[(13,14)].sort() == [(13, 13), (13, 12)].sort()

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Pawn(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(8,9)] == [(8,11)]
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Pawn(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(9,8)].sort() == [(9, 9), (9, 10)].sort()
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Pawn(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(7,8)].sort() == [(7, 9), (7, 10)].sort()
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[8][9].piece = Pawn(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    assert modified_board.valid_moves[(7,8)].sort() == [(7, 10), (8, 11)].sort()


def test_elephants():
    #Initial board state move availability check for some pieces
    assert original_board.valid_moves[(2,4)].sort() == [(0, 7), (4, 7)].sort()
    assert original_board.valid_moves[(13,16)] == [(11, 13)] 
    assert original_board.valid_moves[(15,15)] == [(13, 12)] 

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Elephant(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(8,9)] == [(7, 10), (9, 10), (7, 7), (9, 7), (6, 12), (10, 12)]

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Elephant(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(9,8)].sort() == [(8, 7), (7, 8), (5, 8), (11, 8), (13, 8), (10, 10), (11, 11)].sort()
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Elephant(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(7,8)].sort() == [(9, 8), (11, 8), (8, 7), (6, 10), (5, 11), (5, 8), (3, 8)].sort()
    
   #Testing to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[9][8].piece = Elephant(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    assert modified_board.valid_moves[(7,8)].sort() == [(8, 7), (5, 8), (11, 8), (13, 8), (10, 10), (11, 11)].sort()

