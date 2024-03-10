/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Tile from './Tile';
import Piece from './Piece';
import Logo from './icons/Logo';

function Board({
  initialBoard, gameCode, disabled, socket, initialColor, initialValidMoves, initialTurn, local, gameData,
}) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(gameData?.winner ? gameData[gameData?.winner] : null);
  const [selectedPieceDest, setSelectedPieceDest] = useState(null);
  const [confirmMoveModalOpen, setConfirmMoveModalOpen] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [validMoves, setValidMoves] = useState(initialValidMoves);
  const [winnerModalOpen, setWinnerModalOpen] = useState(!!gameData?.winner);
  const [color, setColor] = useState(initialColor);
  const [turn, setTurn] = useState(initialTurn);

  const parseBoardData = (data) => {
    const parsedBoard = [];
    Object.keys(data).forEach((key) => {
      const [x, y] = key.match(/\d+/g).map(Number);
      if (!parsedBoard[x]) {
        parsedBoard[x] = [];
      }
      parsedBoard[x][y] = data[key];
    });
    return parsedBoard;
  };

  const [board, setBoard] = useState(parseBoardData(initialBoard));

  useEffect(() => {
    if (!socket || disabled) return;

    const handleReceiveMove = (data) => {
      setBoard(parseBoardData(data.board));
      setValidMoves(data.valid_moves);
      setTurn(data.turn);
      if (local) {
        setColor(data.turn);
      }
    };

    const handleGameEnd = (data) => {
      setWinner(gameData[data.winner]);
      setWinnerModalOpen(true);
    };

    socket.on('receive_move', handleReceiveMove);
    socket.on('game_end', handleGameEnd);

    return () => {
      socket.off('receive_move', handleReceiveMove);
      socket.off('game_end', handleGameEnd);
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
        setBoard(parseBoardData(data.board));
        setSelectedPiece(null);
        setTurn(data.turn);
        if (local) {
          setColor(data.turn);
        }
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
    if (turn !== color) { return; }
    if (selectedPiece) {
      setConfirmMoveModalOpen(true);
      setSelectedPieceDest({ columnNumber, index });
      setPossibleMoves([]);
    } else if (board[columnNumber][index].piece !== '') {
      setSelectedPiece({ columnNumber, index });
      const moves = validMoves[`${columnNumber},${index}`] || [];
      setPossibleMoves(moves);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [confirmMoveModalOpen]);

  const isPossibleMove = (columnNumber, index) => possibleMoves.some((move) => move === `${columnNumber},${index}`);

  const disableTile = (piece) => disabled || (piece !== '' && !piece.includes(color));

  const generateBoardUI = () => board.slice().reverse().map((column, displayColumnIndex) => {
    const columnIndex = board.length - 1 - displayColumnIndex;
    const normalCells = column.filter((cell) => cell.type === 'NORMAL');

    return (
      <div key={`column-${columnIndex}`} className={`column-${columnIndex} flex flex-col justify-center items-center ml-[-1.9rem]`}>
        {column.map((cell, cellIndex) => {
          if (cell.type !== 'NORMAL') { return null; }

          const normalCellIndex = normalCells.findIndex((normalCell) => normalCell === cell);
          const isDiamond = (displayColumnIndex + 1) % 2 !== 0;
          const flip = displayColumnIndex >= 7;
          let orientation;

          if (isDiamond) {
            orientation = 1;
          } else if ([3, 9, 13].includes(displayColumnIndex)) {
            orientation = flip ? (cellIndex % 2 === 0 ? 2 : 0) : (cellIndex % 2 !== 0 ? 2 : 0);
          } else { orientation = flip ? (cellIndex % 2 !== 0 ? 2 : 0) : (cellIndex % 2 === 0 ? 2 : 0); }

          return (
            <Tile
              key={`${columnIndex}-${cellIndex}`}
              orientation={orientation}
              colour={(normalCellIndex + normalCells.length) % 3}
              onClick={() => handleTileClick(columnIndex, cellIndex)}
              disabled={disableTile(cell.piece)}
              highlight={isPossibleMove(columnIndex, cellIndex)}
            >
              {cell.piece && (
              <Piece
                className={`${color === 'black' && !local ? 'rotate-180' : ''}`}
                name={cell.piece}
                isSelected={selectedPiece && selectedPiece.columnNumber === columnIndex && selectedPiece.index === cellIndex}
              />
              )}
            </Tile>
          );
        })}
      </div>
    );
  });

  return (
    <div>
      <div className={`flex justify-center items-center ${color === 'black' && !local ? 'rotate-180' : ''}`}>
        {generateBoardUI()}
      </div>

      <ConfirmMoveModal open={confirmMoveModalOpen}>
        <div className="flex-col items-center justify-center w-full bg-slate-600">
          <div className="text-center mx-2 m-1 mb-2 text-2xl font-bold text-white">
            Confirm move?
          </div>
          <div className="flex">
            <button onClick={handleCanceledMove} className="relative pb-4 mx-1 text-xl rounded-lg font-semibold border border-gray-100 text-gray-100 px-4 py-2 hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-300" type="button">
              Cancel
              <svg width="20" height="20" className="absolute bottom-0 right-2 w-6 h-6 text-gray-100" viewBox="0 0 24 24" fill="currentColor" x="26" y="26" role="img" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7h6v2H3v2h4v2H3v2h4v2H1V7m10 0h4v2h-4v2h2a2 2 0 0 1 2 2v2c0 1.11-.89 2-2 2H9v-2h4v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2m8 0h2a2 2 0 0 1 2 2v1h-2V9h-2v6h2v-1h2v1c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2Z" />
              </svg>
            </button>
            <button onClick={handleConfirmedMove} className="relative pb-4 mx-1 text-xl rounded-lg font-semibold bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:bg-green-700" type="button">
              Confirm
              <svg width="50px" height="50px" className="absolute bottom-0 right-2 w-6 h-6 text-gray-100" viewBox="0 0 24 24" fill="currentColor" x="231" y="231" role="img" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M19 7v4H5.83l3.58-3.59L8 6l-6 6l6 6l1.41-1.42L5.83 13H21V7h-2Z" />
              </svg>
            </button>
          </div>
        </div>
      </ConfirmMoveModal>

      {winner && (
        <GameOverModal
          open={winnerModalOpen && winner !== null}
          winner={winner}
          onClose={() => { setWinnerModalOpen(false); }}
        />
      )}
    </div>
  );
}

export default Board;

export function ConfirmMoveModal({ open, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'visible' : 'invisible'}`}>
      <div className={`fixed bg-slate-600 rounded-md shadow-lg p-3 border-2 border-gray-700 flex items-center space-x-2 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function GameOverModal({ open, winner, onClose }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? 'visible' : 'invisible'}`}>
      <div className="relative bg-slate-600 rounded-lg shadow-xl p-6 m-4 max-w-sm max-h-full text-center z-50">
        <button onClick={onClose} className="absolute top-0 right-0 p-2 mr-2 text-white text-2xl hover:text-gray-300" type="button">
          &times;
        </button>
        <Logo />
        <h2 className="text-center mx-2 m-1 mb-0 text-3xl font-bold text-white">
          {`${winner.color.charAt(0).toUpperCase() + winner.color.slice(1).toLowerCase()} Won!`}
        </h2>
        <Link href="/">
          <button className="w-full mx-1 mt-5 text-xl rounded-lg font-semibold bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:bg-green-700" type="button">
            Play Again
          </button>
        </Link>
      </div>
    </div>
  );
}
