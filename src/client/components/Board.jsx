/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import Piece from './Piece';

function Board({
  initialBoard, gameCode, disabled, socket,
}) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMove = (data) => {
      setBoard(data);
    };

    socket.on('receive_move', handleReceiveMove);

    return () => {
      socket.off('receive_move', handleReceiveMove);
    };
  }, [socket]);

  const postMove = (oldPosition, newPosition) => {
    fetch(`http://${window.location.hostname}:8080/api/game/${gameCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_pos: oldPosition, new_pos: newPosition }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBoard(data.board);
        setSelectedPiece(null);
        socket.emit('send_move', { room: gameCode, game_id: gameCode });
      })
      .catch((error) => console.error(error));
  };

  const handleTileClick = (columnNumber, index) => {
    if (selectedPiece) {
      postMove(`${selectedPiece.columnNumber},${selectedPiece.index}`, `${columnNumber},${index}`);
    } else if (board[columnNumber][index]) {
      setSelectedPiece({ columnNumber, index });
    }
  };

  let flip = false;
  const generateColumn = ({ columnNumber, columnHeight, isSecondColumn }) => (
    Array.from({ length: columnHeight }, (_, index) => (
      <Tile
        key={`${columnNumber}: ${index}`}
        orientation={isSecondColumn ? (flip ? (index % 2 !== 0 ? 2 : 0) : (index % 2 === 0 ? 2 : 0)) : 1}
        colour={(index + columnHeight) % 3}
        onClick={() => handleTileClick(columnNumber, index)}
        disabled={disabled}
      >
        {board[columnNumber][index] && (
          <Piece
            name={board[columnNumber][index]}
            isSelected={selectedPiece && selectedPiece.columnNumber === columnNumber && selectedPiece.index === index}
          />
        )}
      </Tile>
    )));

  const columns = [];
  let vertical = false;

  for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
    const column = board[columnIndex];
    columns.push(
      <div className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columnIndex, columnHeight: column.length, isSecondColumn: vertical })}
      </div>,
    );
    vertical = !vertical;
    if (columnIndex === 7) {
      flip = true;
    }
  }

  return (
    <div className="flex justify-center items-center">
      {columns}
    </div>
  );
}

export default Board;
