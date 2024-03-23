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
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(8, 7), (8, 11), (9, 7), (7, 7), (9, 8), (7, 8), (9, 9), (7, 9), (7, 10), (9, 10)])
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = King(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(9, 7), (10, 10), (8, 7), (7, 7), (11, 8), (10, 8), (7, 8), (11, 9), (9, 9), (8, 9)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = King(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(7, 7), (8, 9), (8, 7), (9, 8), (9, 7), (7, 9), (6, 10), (6, 8), (5, 8), (5, 9)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(7, 7), (8, 9), (8, 7), (9, 8), (9, 7), (7, 9), (6, 10), (6, 8), (5, 8), (5, 9)])


  
def test_pawns():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(1,5)]) == sorted([(1, 6), (1, 7)])
    assert sorted(original_board.valid_moves[(2,14)]) == sorted([(2, 12)])
    assert sorted(original_board.valid_moves[(6,6)]) == sorted([(6, 8)])
    assert sorted(original_board.valid_moves[(13,14)]) == sorted([(13, 13), (13, 12)])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Pawn(0)
    modified_board.update_valid_moves()
    assert modified_board.valid_moves[(8,9)] == sorted([(8,11)])
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Pawn(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(9, 9), (9, 10)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Pawn(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(7, 9), (7, 10)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[8][9].piece = Pawn(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(7, 10), (8, 11)])


def test_elephants():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(2,4)]) == sorted([(0, 7), (4, 7)])
    assert sorted(original_board.valid_moves[(13,16)]) == sorted([(11, 13)])
    assert sorted(original_board.valid_moves[(15,15)]) == sorted([(13, 12)])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Elephant(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(7, 10), (9, 10), (7, 7), (9, 7), (6, 12), (10, 12)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Elephant(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 7), (7, 8), (5, 8), (11, 8), (13, 8), (10, 10), (11, 11)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Elephant(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(9, 8), (11, 8), (8, 7), (6, 10), (5, 11), (5, 8), (3, 8)])
    
   #Testing to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[9][8].piece = Elephant(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 7), (5, 8), (11, 8), (13, 8), (10, 10), (11, 11)])



def test_cats():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(5,4)]) == sorted([(9, 6), (5, 6), (3, 7), (7, 7)])
    assert sorted(original_board.valid_moves[(11,15)]) == sorted([(11, 13), (7, 13), (9, 12), (13, 12)])
    assert sorted(original_board.valid_moves[(8, 17)]) == sorted([(8, 13)])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Cat(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(10, 8), (6, 8), (10, 10), (10, 12), (6, 10), (6, 12), (8, 13), (4, 9), (12, 9)])
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Cat(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(11, 7), (13, 10), (9, 6), (5, 6), (7, 9), (5, 8), (9, 10), (13, 8), (7, 11), (11, 11)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Cat(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(9, 9), (3, 10), (11, 6), (7, 6), (7, 10), (5, 7), (3, 8), (5, 11), (11, 8), (9, 11)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly. 
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(9, 9), (3, 10), (11, 6), (7, 6), (7, 10), (5, 7), (3, 8), (5, 11), (11, 8), (9, 11)])


def test_jesters():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(7,17)]) == sorted([])
    assert sorted(original_board.valid_moves[(8,1)]) == sorted([])
    assert sorted(original_board.valid_moves[(9,2)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Jester(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(12, 9), (16, 9), (4, 9), (0, 9), (8, 7), (8, 11), (8, 13), (8, 15)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Jester(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(7, 11), (5, 14), (7, 7), (5, 6), (11, 9), (13, 10), (15, 11)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Jester(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(9, 11), (11, 14), (9, 7), (11, 6), (5, 9), (3, 10), (1, 11)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[8][9].piece = Jester(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(12, 9), (16, 9), (4, 9), (0, 9), (8, 7), (8, 11), (8, 13), (8, 15)])


def test_bishops():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(1,4)]) == sorted([])
    assert sorted(original_board.valid_moves[(14,16)]) == sorted([])
    assert sorted(original_board.valid_moves[(3,16)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Bishop(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(7, 7), (9, 7), (7, 10), (6, 12), (5, 13), (4, 15), (9, 10), (10, 12), (11, 13), (12, 15)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Bishop(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 7), (10, 10), (11, 11), (12, 13), (13, 14), (7, 8), (5, 8), (3, 8), (1, 8), (11, 8), (13, 8), (15, 8)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Bishop(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(6, 10), (5, 11), (4, 13), (3, 14), (8, 7), (5, 8), (3, 8), (1, 8), (9, 8), (11, 8), (13, 8), (15, 8)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[9][8].piece = Bishop(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 7), (10, 10), (11, 11), (12, 13), (13, 14), (11, 8), (13, 8), (15, 8)])


def test_shields():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(5,3)]) == sorted([(7, 6), (5, 6)])
    assert sorted(original_board.valid_moves[(10,16)]) == sorted([])
    assert sorted(original_board.valid_moves[(13,15)]) == sorted([(13, 12), (11, 12)])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Shield(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(9, 10), (11, 10), (12, 9), (11, 7), (9, 7), (7, 7), (4, 9), (7, 10), (5, 10), (5, 7)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Shield(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 7), (11, 8), (12, 7), (10, 10), (9, 11), (7, 11), (6, 10), (7, 8)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Shield(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(5, 8), (9, 8), (6, 10), (10, 10), (9, 11), (7, 11), (8, 7), (4, 7)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[8][9].piece = Shield(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(9, 10), (11, 10), (12, 9), (11, 7), (9, 7), (7, 7), (4, 9), (7, 10), (5, 10), (5, 7)])


def test_rooks():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(5,2)]) == sorted([])
    assert sorted(original_board.valid_moves[(11,17)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Rook(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(7, 9), (6, 10), (5, 10), (4, 11), (3, 11), (2, 12), (1, 12), (0, 13), (9, 9), (10, 10), (11, 10), (12, 11), (13, 11), (14, 12), (15, 12), (16, 13), (7, 8), (6, 8), (5, 7), (4, 7), (3, 6), (9, 8), (10, 8), (11, 7), (12, 7), (13, 6)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Rook(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(9, 7), (9, 6), (9, 9), (9, 10), (9, 11), (9, 12), (9, 13), (9, 14), (8, 9), (7, 9), (6, 10), (5, 10), (4, 11), (3, 11), (2, 12), (1, 12), (0, 13), (10, 8), (11, 7), (12, 7), (13, 6)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Rook(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(7, 7), (7, 6), (7, 9), (7, 10), (7, 11), (7, 12), (7, 13), (7, 14), (6, 8), (5, 7), (4, 7), (3, 6), (8, 9), (9, 9), (10, 10), (11, 10), (12, 11), (13, 11), (14, 12), (15, 12), (16, 13)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[8][9].piece = Rook(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()

    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(7, 9), (6, 10), (5, 10), (4, 11), (3, 11), (2, 12), (1, 12), (0, 13), (9, 9), (10, 10), (11, 10), (12, 11), (13, 11), (14, 12), (15, 12), (16, 13), (9, 8), (10, 8), (11, 7), (12, 7), (13, 6)])


def test_machine():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(7,3)]) == sorted([])
    assert sorted(original_board.valid_moves[(9,16)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Machine(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(9, 9), (7, 9), (9, 8), (7, 8), (10, 10), (6, 10), (10, 8), (6, 8)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Machine(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(9, 9), (9, 7), (9, 10), (9, 6), (8, 9), (10, 8), (7, 9), (11, 7)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Machine(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(7, 9), (7, 7), (7, 10), (7, 6), (6, 8), (8, 9), (5, 7), (9, 9)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[9][8].piece = Machine(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(9, 9), (9, 7), (9, 10), (9, 6), (8, 9), (10, 8), (7, 9), (11, 7)])


def test_dog():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(3,15)]) == sorted([(5,12)])
    assert sorted(original_board.valid_moves[(11,3)]) == sorted([(9,6)])
    assert sorted(original_board.valid_moves[(6,4)]) == sorted([(6,8)])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Dog(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(8, 11), (8, 13), (8, 7), (4, 9), (12, 9)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Dog(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(7, 7), (5, 6), (7, 11), (11, 9), (13, 10)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Dog(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(11, 6), (9, 7), (9, 11), (5, 9), (3, 10)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(11, 6), (9, 7), (9, 11), (5, 9), (3, 10)])


def test_prince():
    #Initial board state move availability check for some pieces
    assert sorted(original_board.valid_moves[(4,3)]) == sorted([])
    assert sorted(original_board.valid_moves[(12,17)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Prince(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(8, 7), (8, 11), (9, 7), (7, 7), (9, 8), (7, 8), (9, 9), (7, 9), (7, 10), (9, 10)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Prince(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(9, 7), (10, 10), (8, 7), (7, 7), (11, 8), (10, 8), (7, 8), (11, 9), (9, 9), (8, 9)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Prince(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(7, 7), (8, 9), (8, 7), (9, 8), (9, 7), (7, 9), (6, 10), (6, 8), (5, 8), (5, 9)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[8][9].piece = Prince(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(8, 7), (8, 11), (9, 7), (7, 7), (9, 8), (9, 9), (7, 9), (7, 10), (9, 10)])


def test_mammoth():
    #Initial board state move availability check for all pieces
    assert sorted(original_board.valid_moves[(10,2)]) == sorted([])
    assert sorted(original_board.valid_moves[(10,18)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Mammoth(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(8, 7), (8, 11), (9, 9), (7, 9), (7, 8), (9, 8), (9, 10), (7, 10), (7, 7), (9, 7), (6, 10), (10, 10), (6, 8), (10, 8), (4, 9), (12, 9), (8, 13), (6, 12), (10, 12)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Mammoth(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 9), (7, 8), (5, 8), (10, 8), (11, 8), (13, 8), (9, 7), (7, 7), (8, 7), (11, 7), (9, 6), (5, 6), (9, 9), (9, 10), (7, 9), (11, 9), (13, 10), (7, 11), (11, 11), (10, 10)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Mammoth(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(6, 8), (5, 8), (3, 8), (8, 9), (9, 8), (11, 8), (7, 7), (5, 7), (8, 7), (9, 7), (7, 6), (11, 6), (7, 9), (7, 10), (6, 10), (5, 9), (9, 9), (3, 10), (5, 11), (9, 11)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[9][8].piece = Mammoth(0)
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(8, 9), (5, 8), (10, 8), (11, 8), (13, 8), (9, 7), (7, 7), (8, 7), (11, 7), (9, 6), (5, 6), (9, 9), (9, 10), (7, 9), (11, 9), (13, 10), (7, 11), (11, 11), (10, 10)])


def test_hawk():
    #Initial board state move availability check for all pieces
    assert sorted(original_board.valid_moves[(6,2)]) == sorted([(6, 8), (9, 6), (3, 6)])
    assert sorted(original_board.valid_moves[(6,18)]) == sorted([(6, 12), (9, 13), (3, 13)])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Hawk(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(10, 8), (6, 8), (10, 10), (10, 12), (6, 10), (6, 12), (8, 13), (8, 15), (0, 9), (16, 9), (11, 7), (5, 7), (11, 10), (11, 13), (5, 10), (5, 13)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Hawk(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(11, 7), (13, 10), (9, 6), (5, 6), (7, 9), (5, 8), (9, 10), (13, 8), (11, 11), (15, 11), (12, 13), (9, 11), (6, 10), (3, 8), (12, 7), (15, 8), (5, 14)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Hawk(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(9, 9), (3, 10), (11, 6), (7, 6), (7, 10), (5, 7), (3, 8), (5, 11), (11, 8), (11, 14), (13, 8), (7, 11), (4, 13), (4, 7), (1, 8), (1, 11), (10, 10)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(9, 9), (3, 10), (11, 6), (7, 6), (7, 10), (5, 7), (3, 8), (5, 11), (11, 8), (11, 14), (13, 8), (7, 11), (4, 13), (4, 7), (1, 8), (1, 11), (10, 10)])


def test_queen():
    #Initial board state move availability check for all pieces
    assert sorted(original_board.valid_moves[(9,1)]) == sorted([])
    assert sorted(original_board.valid_moves[(9,18)]) == sorted([])

    #Test to make sure correct moves are generated around the piece when the area around it is empty. This piece is located in a diamond tile.
    modified_board = ChessBoard()
    modified_board.board[8][9].piece = Queen(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(8,9)]) == sorted([(6, 12), (12, 7), (4, 9), (5, 7), (5, 13), (4, 15), (5, 10), (9, 8), (8, 15), (10, 12), (13, 11), (1, 12), (7, 7), (16, 13), (7, 10), (6, 8), (12, 9), (3, 6), (14, 12), (12, 15), (4, 11), (9, 7), (8, 11), (9, 10), (11, 7), (11, 10), (10, 8), (0, 13), (11, 13), (16, 9), (7, 9), (6, 10), (12, 11), (4, 7), (3, 11), (9, 9), (8, 7), (0, 9), (8, 13), (10, 10), (2, 12), (13, 6), (15, 12), (7, 8)])

    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted right diamond tile.
    modified_board.board[8][9].piece = None
    modified_board.board[9][8].piece = Queen(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(9,8)]) == sorted([(12, 7), (12, 13), (5, 10), (8, 9), (9, 14), (9, 11), (11, 8), (11, 11), (13, 8), (1, 12), (13, 14), (15, 11), (15, 8), (7, 7), (5, 6), (4, 11), (9, 7), (9, 10), (11, 7), (9, 13), (10, 8), (0, 13), (1, 8), (13, 10), (7, 9), (6, 10), (3, 11), (3, 8), (9, 9), (8, 7), (5, 8), (9, 6), (9, 12), (5, 14), (11, 9), (10, 10), (2, 12), (13, 6), (7, 11), (7, 8)])
 
    #Test to make sure correct moves are generated around the piece when the area around it is largely empty. This piece is located in a slanted left diamond tile.
    modified_board.board[9][8].piece = None
    modified_board.board[7][8].piece = Queen(0)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(3, 10), (5, 7), (8, 9), (9, 8), (9, 11), (11, 8), (11, 14), (13, 11), (13, 8), (7, 7), (15, 8), (16, 13), (7, 10), (6, 8), (7, 13), (3, 6), (14, 12), (5, 9), (9, 7), (11, 10), (1, 11), (1, 8), (7, 9), (7, 6), (7, 12), (6, 10), (12, 11), (4, 7), (3, 8), (3, 14), (5, 11), (4, 13), (9, 9), (15, 12), (8, 7), (5, 8), (11, 6), (10, 10), (7, 11), (7, 14)])
    
   #Test to make sure that correct moves are generated around the piece with enemy pieces in random spots close to it(not including the initial board pieces. This piece will be located in one of the three tiles chosen randomly.
    modified_board.board[7][10].piece = Pawn(1)
    modified_board.board[5][8].piece = Pawn(1)
    modified_board.board[9][11].piece = Pawn(1)
    modified_board.board[11][9].piece = Pawn(1)
    modified_board.update_valid_moves()
    assert sorted(modified_board.valid_moves[(7,8)]) == sorted([(3, 10), (5, 7), (8, 9), (9, 8), (9, 11), (11, 8), (13, 11), (13, 8), (7, 7), (15, 8), (16, 13), (7, 10), (6, 8), (3, 6), (14, 12), (5, 9), (9, 7), (11, 10), (1, 11), (7, 9), (7, 6), (6, 10), (12, 11), (4, 7), (3, 14), (5, 11), (4, 13), (9, 9), (8, 7), (5, 8), (11, 6), (10, 10), (15, 12)])

