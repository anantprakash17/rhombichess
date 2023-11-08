/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React from 'react';
import Tile from './Tile';

function Board() {
  let flip = false;
  const generateColumn = ({ columnNumber, columnHeight, isSecondColumn }) => (
    Array.from({ length: columnHeight }, (_, index) => (
      <Tile
        key={`${columnNumber}: ${index}`}
        orientation={isSecondColumn ? (flip ? (index % 2 !== 0 ? 2 : 0) : (index % 2 === 0 ? 2 : 0)) : 1}
        colour={(index + columnHeight) % 3}
      />
    ))
  );

  const columns = [];

  // First loop: 6 to 9
  for (let i = 6; i <= 9; i++) {
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length + 1, columnHeight: i, isSecondColumn: false })}
      </div>,
    );
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length + 1, columnHeight: i * 2, isSecondColumn: true })}
      </div>,
    );
  }

  // Manually add the 10th column
  columns.push(
    <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
      {generateColumn({ columnNumber: columns.length + 1, columnHeight: 10, isSecondColumn: false })}
    </div>,
  );

  flip = true;

  // Second loop: 9 to 6
  for (let i = 9; i >= 6; i--) {
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length + 1, columnHeight: i * 2, isSecondColumn: true })}
      </div>,
    );
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columns.length + 1, columnHeight: i, isSecondColumn: false })}
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
