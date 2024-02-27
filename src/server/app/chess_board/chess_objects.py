from abc import ABC, abstractmethod
from enum import Enum


class PieceType(Enum):
    KING = "king"
    QUEEN = "queen"
    PAWN = "pawn"
    ROOK = "rook"
    BISHOP = "bishop"
    MACHINE = "machine"
    KNIGHT = "knight"
    SHIELD = "shield"
    JESTER = "jester"
    CAT = "cat"
    ELEPHANT = "elephant"
    SOLDIER = "soldier"
    PRINCE = "prince"
    DOG = "dog"
    MAMMOTH = "mammoth"
    HAWK = "hawk"
    PADDING = "padding"
    DIAMOND = "diamond"


class TileType(Enum):
    PADDING = "padding"
    DIAMOND = "diamond"
    NORMAL = "normal"


class ChessPiece(ABC):
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

    """
    TODO: MAKE SURE TO ADD THE ABSTRACT METHOD TO THE ChessPiece CLASS
    """
    # @abstractmethod
    def calculate_valid_moves(self, position: tuple[int, int], board) -> list[tuple[int, int]]:
        """
        Calculate valid moves for the chess piece from the given position
        Args:
            position: The current position of the piece on the board
        Returns:
            A list of valid moves
        """
        pass


class ChessTile:
    def __init__(self, piece: ChessPiece, color: int, orientation: int, type: TileType) -> None:
        """
        Initializes a chess tile
        Args:
            piece (ChessPiece): piece on the tile
            color (int): color of the tile
            orientation (int): orientation of the tile
            type (TileType): type of the tile
        """
        self.piece: ChessPiece = piece
        self.color = color
        self.orientation = orientation
        self.type = type

    def is_empty(self) -> bool:
        """
        Returns:
            bool: True if the tile is empty, False otherwise
        """
        return self.piece is None

    def __str__(self):
        return f"Piece: {self.piece}, Color: {self.color}, Orientation: {self.orientation}"

    def __repr__(self) -> str:
        if self.type == TileType.DIAMOND:
            return "di"
        if self.type == TileType.PADDING:
            return "pa"
        if not self.piece:
            return "bl"
        return f"Piece: {self.piece.get_piece()}"
