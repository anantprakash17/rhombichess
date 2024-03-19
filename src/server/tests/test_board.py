import pytest
from app.chess_board.chess_objects import ChessPiece, ChessTile, PieceType, TileType
from app.chess_board.chess_pieces import *
from app.chess_board.board import *


@pytest.fixture
def chess_board():
    return ChessBoard()


def test_board_initialization(chess_board):
    board = chess_board.get_board()
    #testing that the properties of the board return as expected
    assert len(board) == 17
    assert len(board[0]) == 21



def test_move_piece(chess_board):
    #test to make sure that piece moves to correct empty tile and returns proper output 
    start = (10, 6) 
    end = (10, 8)
    result = chess_board.move_piece(start,end)
    chess_board.move_piece(start,end)
    assert result == True
    assert chess_board.board[10][6].piece == None
    assert chess_board.board[10][8].piece.name == PieceType.PAWN
    
    #test to make sure any invalid moves return False and prevent any change to the board
    start = (10, 6)
    end = (10, 9)
    new_board = ChessBoard()
    result2 = new_board.move_piece(start,end)
    new_board.move_piece(start,end)
    assert result2 == False
    assert new_board.board[10][6].piece.name == PieceType.PAWN
    assert new_board.board[10][8].piece == None


def test_capture_piece(chess_board):
    # Setup the board with a piece at end position that can be captured
    chess_board.board[8][9].piece = Queen(0)
    chess_board.board[8][11].piece = Pawn(1)
    chess_board.update_valid_moves()
    chess_board.move_piece((8,9), (8,11))
    chess_board.captured_pieces
    assert chess_board.captured_pieces == {'black': [], 'white': ['pawn-white']}


def test_king_check(chess_board):
    #check to make sure in default state where the kings are surrounded by their own allies that a check is not in place
    assert chess_board.king_check(0) == False
    assert chess_board.king_check(1) == False

    chess_board.board[7][17].piece = Queen(0)
    chess_board.update_valid_moves()
    assert chess_board.king_check(1) == True
