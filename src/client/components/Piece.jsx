import React from 'react';

const PieceType = {
  ROOK: 'Rook',
  MACHINE: 'Machine',
  BISHOP: 'Bishop',
  ELEPHANT: 'Elephant',
  JESTER: 'Jester',
  DOG: 'Dog',
  QUEEN: 'Queen',
  MAMMOTH: 'Mammoth',
  CAT: 'Cat',
  HAWK: 'Hawk',
  SHEILD: 'Sheild',
  KNIGHT: 'Knight',
  KING: 'King',
  PRINCE: 'Prince',
  PAWN: 'Pawn',
  SOLDIER: 'Soldier',
};

const PieceColour = {
  WHITE: 'White',
  BLACK: 'Black',
};

function getImageURL(type, colour) {
  const imageCollection = {
    [PieceType.QUEEN]: {
      [PieceColour.BLACK]: '/pieces/queen-blk.png',
      [PieceColour.WHITE]: ''
    },
  };
  return imageCollection[type][colour];

}

function Piece ({type, colour, location}) {

  const imageURL = getImageURL(type, colour);

  return (
    <div className='w-10'>
      <img src={imageURL} alt={`${colour} ${type}`} />
    </div>
  );
}

export { PieceType, PieceColour, Piece };