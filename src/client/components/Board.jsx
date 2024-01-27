/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import Piece from './Piece';
import ConfirmMoveModal from './ConfirmMoveModal';

function Board({
  initialBoard, gameCode, disabled, socket, color,
}) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [sndSelectedPiece, setSndSelectedPiece] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [confirmMoveModalOpen, setConfirmMoveModalOpen] = useState(false);

  useEffect(() => {
    if (!socket || disabled) return;

    const handleReceiveMove = (data) => {
      setBoard(data);
    };

    socket.on('receive_move', handleReceiveMove);

    return () => {
      socket.off('receive_move', handleReceiveMove);
    };
  }, [socket]);

  const postMove = (oldPosition, newPosition) => {
    if (typeof window === 'undefined') {
      return;
    }

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

  const handleCanceledMove = () => {
    setConfirmMoveModalOpen(false);
    setSelectedPiece(null);
    setSndSelectedPiece(null);
  };

  const handleConfirmedMove = () => {
    postMove(`${selectedPiece.columnNumber},${selectedPiece.index}`, `${sndSelectedPiece.columnNumber},${sndSelectedPiece.index}`);
    setConfirmMoveModalOpen(false);
    setSelectedPiece(null);
    setSndSelectedPiece(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && confirmMoveModalOpen) {
      handleConfirmedMove();
    }
  };

  const handleTileClick = (columnNumber, index) => {
    if (selectedPiece) {
      setConfirmMoveModalOpen(true);
      setSndSelectedPiece({ columnNumber, index });
    } else if (board[columnNumber][index]) {
      setSelectedPiece({ columnNumber, index });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [confirmMoveModalOpen]);

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
            className={`${color === 'black' ? 'rotate-180' : ''}`}
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
      <div key={`column-${columnIndex}`} className="flex flex-col justify-center items-center ml-[-1.9rem]">
        {generateColumn({ columnNumber: columnIndex, columnHeight: column.length, isSecondColumn: vertical })}
      </div>,
    );
    vertical = !vertical;
    if (columnIndex === 7) {
      flip = true;
    }
  }

  return (
    <div>
      <div className={`flex justify-center items-center ${color === 'black' ? 'rotate-180' : ''}`}>
        {columns}
      </div>

      <ConfirmMoveModal open={confirmMoveModalOpen} onClose={() => setConfirmMoveModalOpen(false)}>
        <div className="mx-auto my-4 w-full">
          <h2 className="mb-4 text-2xl font-bold tracking-tight leading-none text-gray-900 text-center">
            Confirm move?
          </h2>
          <button onClick={handleCanceledMove} className="mx-2 text-2xl rounded-lg font-semibold bg-blue-400 text-white px-4 py-2 hover:bg-blue-500 focus:bg-blue-600" type="button">
            Cancel
          </button>
          <button onClick={handleConfirmedMove} className="mx-2 text-2xl rounded-lg font-semibold bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:bg-green-700" type="button">
            Confirm
          </button>
        </div>
      </ConfirmMoveModal>
    </div>
  );
}

export default Board;
