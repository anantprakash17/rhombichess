/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import Piece from './Piece';

function Board({
  initialBoard, gameCode, disabled, socket, color, initialValidMoves,
}) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPieceDest, setSelectedPieceDest] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [confirmMoveModalOpen, setConfirmMoveModalOpen] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [validMoves, setValidMoves] = useState(initialValidMoves);
  console.log(initialValidMoves);
  useEffect(() => {
    if (!socket || disabled) return;

    const handleReceiveMove = (data) => {
      setBoard(data.board);
      setValidMoves(data.valid_moves);
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
    setSelectedPieceDest(null);
    setPossibleMoves([]);
  };

  const handleConfirmedMove = () => {
    postMove(`${selectedPiece.columnNumber},${selectedPiece.index}`, `${selectedPieceDest.columnNumber},${selectedPieceDest.index}`);
    setConfirmMoveModalOpen(false);
    setSelectedPiece(null);
    setSelectedPieceDest(null);
    setPossibleMoves([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && confirmMoveModalOpen) {
      handleConfirmedMove();
    } else if (event.key === 'Escape' && confirmMoveModalOpen) {
      handleCanceledMove();
    } else if (event.key === 'Escape') {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const handleTileClick = (columnNumber, index) => {
    if (selectedPiece) {
      setConfirmMoveModalOpen(true);
      setSelectedPieceDest({ columnNumber, index });
      setPossibleMoves([]);
    } else if (board[columnNumber][index]) {
      setSelectedPiece({ columnNumber, index });
      const moves = validMoves[`${columnNumber},${index}`] || [];
      setPossibleMoves(moves);
    }
  };

  const isPossibleMove = (columnNumber, index) => possibleMoves.some((move) => move === `${columnNumber},${index}`);

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
        highlight={isPossibleMove(columnNumber, index)}
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

      <ConfirmMoveModal open={confirmMoveModalOpen}>
        <div className="flex-col items-center justify-center w-full">
          <div className="text-center mx-2 m-1 text-2xl font-bold text-gray-900">
            Confirm move?
          </div>
          <div className="flex">
            <button onClick={handleCanceledMove} className="mx-1 text-xl rounded-lg font-semibold border border-gray-400 text-gray-400 px-4 py-2 hover:bg-gray-200 focus:bg-gray-900" type="button">
              Cancel
            </button>
            <button onClick={handleConfirmedMove} className="mx-1 text-xl rounded-lg font-semibold bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:bg-green-700" type="button">
              Confirm
            </button>
          </div>
        </div>
      </ConfirmMoveModal>

    </div>
  );
}

export default Board;

export function ConfirmMoveModal({ open, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'visible' : 'invisible'}`}>
      <div className={`fixed bg-white rounded-md shadow-xl p-3 border-2 border-gray-300 flex items-center space-x-2 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
