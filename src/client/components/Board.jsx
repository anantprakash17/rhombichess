/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
'use client'

import React, { useState } from 'react';
import Tile from './Tile';
import Piece from './Piece';

function Board({ pieces }) {

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [p, setPieces] = useState(pieces);

  let flip = false;

  const handleTileClick = (columnNumber, index) => {
    if (selectedPiece) {
      if (!p[columnNumber][index] && !(selectedPiece.columnNumber === columnNumber && selectedPiece.index === index)) {
        const newPieces = p.map((col, colIndex) => {
          const newColumn = [...col];
          if (colIndex === selectedPiece.columnNumber) {
            newColumn[selectedPiece.index] = '';
          }
          if (colIndex === columnNumber) {
            newColumn[index] = p[selectedPiece.columnNumber][selectedPiece.index];
          }
          return newColumn;
        });
        setPieces(newPieces);
        setSelectedPiece(null);
      }
    } else if (p[columnNumber][index]) {
      setSelectedPiece({ columnNumber, index });
    }
  };


  const generateColumn = ({ columnNumber, columnHeight, isSecondColumn }) => (
    Array.from({ length: columnHeight }, (_, index) => (
      <Tile
        key={`${columnNumber}: ${index}`}
        orientation={isSecondColumn ? (flip ? (index % 2 !== 0 ? 2 : 0) : (index % 2 === 0 ? 2 : 0)) : 1}
        colour={(index + columnHeight) % 3}
        onClick={() => handleTileClick(columnNumber, index)}
      >
        {pieces[columnNumber][index] && <Piece name={pieces[columnNumber][index]} />}
      </Tile>
    )));

  const columns = [];

  // First loop: 6 to 9
  for (let i = 6; i <= 9; i++) {
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length, columnHeight: i, isSecondColumn: false })}
      </div>,
    );
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length, columnHeight: i * 2, isSecondColumn: true })}
      </div>,
    );
  }

  // Manually add the 10th column
  columns.push(
    <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
      {generateColumn({ columnNumber: columns.length, columnHeight: 10, isSecondColumn: false })}
    </div>,
  );

  flip = true;

  // Second loop: 9 to 6
  for (let i = 9; i >= 6; i--) {
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length, columnHeight: i * 2, isSecondColumn: true })}
      </div>,
    );
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length, columnHeight: i, isSecondColumn: false })}
      </div>,
    );
  }

  return (
    <div className="flex justify-center items-center">
      {columns}
    </div>
  );
}

export default Board;
