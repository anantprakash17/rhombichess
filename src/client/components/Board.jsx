/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Tile from './Tile';
import Piece from './Piece';
import Logo from './icons/Logo';

function Board({
  initialGameData, gameCode, disabled, socket, initialColor,
}) {
  const [gameData, setGameData] = useState(initialGameData);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPieceDest, setSelectedPieceDest] = useState(null);
  const [confirmMoveModalOpen, setConfirmMoveModalOpen] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [winnerModalOpen, setWinnerModalOpen] = useState(!!initialGameData?.winner);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [piecePromotionModalOpen, setPiecePromotionModalOpen] = useState(false);
  const [colorInCheck, setColorInCheck] = useState(null);
  const [color, setColor] = useState(initialColor);

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

  const [board, setBoard] = useState(parseBoardData(initialGameData.board));

  useEffect(() => {
    if (!socket || disabled) return;

    const handleGameData = (data) => {
      setGameData(data);
      setBoard(parseBoardData(data.board));
      setColorInCheck(data.in_check[1] ? 'white' : data.in_check[0] ? 'black' : null);

      if (gameData.local) {
        setColor(data.turn);
      } if (data.winner) {
        setWinnerModalOpen(true);
      }
    };

    socket.on('game_data', handleGameData);

    return () => {
      socket.off('game_data', handleGameData);
    };
  }, [socket]);

  useEffect(() => {
    if (colorInCheck === color) {
      setCheckModalOpen(true);
    }
  }, [color, colorInCheck]);

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
        if (data.promotion) {
          setPiecePromotionModalOpen(true);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleCanceledMove = () => {
    const newBoard = [...board];
    newBoard[selectedPieceDest.columnNumber] = [...newBoard[selectedPieceDest.columnNumber]];
    newBoard[selectedPieceDest.columnNumber][selectedPieceDest.index] = { ...newBoard[selectedPieceDest.columnNumber][selectedPieceDest.index], piece: selectedPieceDest.piece };
    newBoard[selectedPiece.columnNumber][selectedPiece.index] = { ...newBoard[selectedPiece.columnNumber][selectedPiece.index], piece: selectedPiece.piece };
    setBoard(newBoard);

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
    } else if (event.key === 'Escape' && (winnerModalOpen || checkModalOpen)) {
      setWinnerModalOpen(false);
      setCheckModalOpen(false);
    } else if (event.key === 'Escape') {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [confirmMoveModalOpen]);

  const isPossibleMove = (columnNumber, index) => possibleMoves.some((move) => move === `${columnNumber},${index}`);

  const handleTileClick = (columnNumber, index, piece) => {
    const pieceColor = piece.split('-')[1];
    if (gameData.turn !== color) { return; }
    if (selectedPiece?.columnNumber === columnNumber && selectedPiece?.index === index) { return; }
    if (selectedPiece && pieceColor !== color) {
      if (isPossibleMove(columnNumber, index)) {
        const newBoard = [...board];
        newBoard[columnNumber] = [...newBoard[columnNumber]];
        newBoard[columnNumber][index] = { ...newBoard[columnNumber][index], piece: selectedPiece.piece };
        newBoard[selectedPiece.columnNumber][selectedPiece.index] = { ...newBoard[columnNumber][index], piece: '' };
        setBoard(newBoard);

        document.activeElement.blur();
        setSelectedPieceDest({ columnNumber, index, piece });
        setPossibleMoves([]);
        setConfirmMoveModalOpen(true);
      }
    } else if (piece !== '' && pieceColor === color) {
      setSelectedPiece({ columnNumber, index, piece });
      const moves = gameData.valid_moves[`${columnNumber},${index}`] || [];
      setPossibleMoves(moves);
    }
  };

  const generateBoardUI = () => board.slice().reverse().map((column, displayColumnIndex) => {
    const columnIndex = board.length - 1 - displayColumnIndex;
    const normalCells = column.filter((cell) => cell.type === 'NORMAL');

    return (
      <div key={`column-${columnIndex}`} className={`column-${columnIndex} flex flex-col justify-center items-center ml-[-1.9rem]`}>
        {column.map((cell, cellIndex) => {
          if (cell.type !== 'NORMAL') { return null; }

          const isPossible = isPossibleMove(columnIndex, cellIndex);
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
              testid={`${columnIndex}-${cellIndex}`}
              key={`${columnIndex}-${cellIndex}`}
              orientation={orientation}
              colour={(normalCellIndex + normalCells.length) % 3}
              onClick={() => handleTileClick(columnIndex, cellIndex, cell.piece)}
              disabled={disabled || gameData.winner}
              capturable={isPossible && cell.piece}
              highlight={isPossible}
            >
              {cell.piece && (
                <Piece
                  testid={`${cell.piece}-${columnIndex}-${cellIndex}`}
                  className={`${color === 'black' && !gameData.local ? 'rotate-180' : ''}`}
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
      <div data-testid="board" className={`flex justify-center items-center ${color === 'black' && !gameData.local ? 'rotate-180 pl-9' : 'pl-4'}`}>
        {generateBoardUI()}
      </div>

      <ConfirmMoveModal open={confirmMoveModalOpen}>
        <div className="flex-col items-center justify-center w-full bg-slate-600">
          <div className="text-center mx-2 m-1 mb-2 text-2xl font-bold text-white">
            Confirm move?
          </div>
          <div className="flex">
            <button onClick={handleCanceledMove} className="relative pb-4 mx-1 text-xl rounded-lg font-semibold border border-gray-100 text-gray-100 px-4 py-2 hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-300" type="button">
              Undo
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

      {gameData.winner && (
        <GameOverModal
          open={winnerModalOpen && gameData.winner !== null}
          winner={gameData[gameData.winner]}
          checkmate={gameData.checkmate}
          onClose={() => { setWinnerModalOpen(false); }}
        />
      )}
      {checkModalOpen && !gameData.winner && (
        <CheckModal
          open={checkModalOpen}
          onClose={() => { setCheckModalOpen(false); }}
        />
      )}
      {gameData.promotion && color === gameData.turn && (
        <PiecePromotionModal
          color={gameData.turn}
          open={piecePromotionModalOpen}
          gameCode={gameCode}
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

export function GameOverModal({
  open, winner, checkmate, onClose,
}) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? 'visible' : 'invisible'}`}>
      <div className="flex flex-col items-center relative bg-slate-600 rounded-lg shadow-xl p-6 m-4 max-w-sm max-h-full text-center z-50">
        <button onClick={onClose} className="absolute top-0 right-0 p-2 mr-2 text-white text-2xl hover:text-gray-300" type="button">
          &times;
        </button>
        <Logo />
        <h2 className="text-center mx-2 m-1 mb-0 text-3xl font-bold text-white">
          {`${winner.color.charAt(0).toUpperCase() + winner.color.slice(1).toLowerCase()} ${checkmate ? 'won by checkmate!' : 'won!'}`}
        </h2>
        <p className="mt-1 text-xl text-gray-300">
          {winner.name}
        </p>
        <Link href="/" className="w-full">
          <button className="w-full mx-1 mt-5 text-xl rounded-lg font-semibold bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:bg-green-700" type="button">
            Play Again
          </button>
        </Link>
      </div>
    </div>
  );
}

export function CheckModal({ open, onClose }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? 'visible' : 'invisible'}`}>
      <div className="relative bg-slate-600 rounded-lg shadow-xl p-6 m-4 max-w-sm max-h-full text-center z-50">
        <button onClick={onClose} className="absolute top-0 right-0 p-2 mr-2 text-white text-2xl hover:text-gray-300" type="button">
          &times;
        </button>
        <Logo />
        <h2 className="text-center mx-2 m-1 mb-0 text-3xl font-bold text-white">
          Check!
        </h2>
        <p className="mt-1 text-xl text-gray-300">
          You are in check!
        </p>
      </div>
    </div>
  );
}

export function PiecePromotionModal({ color, open, gameCode }) {
  const [selectedPiece, setSelectedPiece] = useState('Queen');

  const pieceNames = [
    'queen', 'jester', 'rook', 'elephant',
    'bishop', 'machine', 'dog', 'mammoth',
    'cat', 'hawk', 'shield', 'knight', 'prince',
  ];

  const handlePromotion = (event) => {
    event.preventDefault();
    fetch(`http://${window.location.hostname}:8080/api/game/promotion/${gameCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ piece: selectedPiece }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        console.error('Failed to promote piece:', error);
      });
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'visible' : 'invisible'}`}>
      <div className={`fixed bg-slate-600 rounded-md shadow-lg p-2 border-2 border-gray-700 flex items-center space-x-2 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <form onSubmit={(event) => handlePromotion(event)}>
          <div className="flex-col items-center justify-center w-full bg-slate-600">
            <div className="flex-col items-center justify-center">
              <ul>
                {pieceNames.map((pieceName) => (
                  <li key={pieceName}>
                    <input
                      type="radio"
                      id={pieceName}
                      name="piecePromotion"
                      value={pieceName}
                      className="hidden peer"
                      required
                      checked={selectedPiece === pieceName}
                      onChange={(event) => setSelectedPiece(event.target.value)}
                    />
                    <label htmlFor={pieceName} className="block relative rounded-lg p-1 m-1 bg-gray-500 hover:bg-gray-100 focus:bg-gray-300 cursor-pointer peer-checked:bg-gray-100">
                      <Image src={`/pieces/${pieceName}-${color}.png`} alt={`${pieceName}-${color}`} width={40} height={30} className="mx-auto" />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button className="relative text-xl p-2 m-1 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 focus:bg-green-700" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 507.68" width="40" height="30">
              <path fill="#f7fafc" d="M442.17 335.59c5.89-13.07 21.27-18.89 34.34-13 13.07 5.89 18.89 21.26 13 34.33-20.4 45.13-53.52 83.3-94.8 109.95-39.99 25.82-87.59 40.8-138.63 40.8-70.71 0-134.73-28.66-181.07-75S0 322.3 0 251.59C0 193.6 19.32 140.08 51.88 97.12c33.29-43.93 80.51-76.81 135.14-92.1 13.8-3.81 28.08 4.29 31.89 18.09 3.81 13.8-4.28 28.08-18.08 31.89-43.37 12.14-80.94 38.34-107.51 73.4-25.93 34.21-41.31 76.89-41.31 123.19 0 56.36 22.84 107.38 59.77 144.31 36.92 36.92 87.94 59.77 144.3 59.77 40.8 0 78.77-11.93 110.6-32.48 32.85-21.21 59.24-51.63 75.49-87.6zm-215.02 22.59h57.86c11.44 0 20.82-9.38 20.82-20.82v-73.87h40.7c6.93-.3 11.86-2.6 14.7-6.92 7.72-11.57-2.81-23-10.12-31.05-20.74-22.76-71.56-77.45-81.79-89.49-7.76-8.58-18.8-8.58-26.56 0-10.57 12.34-63.94 69.53-83.66 91.67-6.84 7.7-15.29 18.21-8.17 28.87 2.91 4.32 7.78 6.62 14.72 6.92h40.68v73.87c0 11.44 9.37 20.82 20.82 20.82zm69.3-306.68c-14.08-2.8-23.22-16.49-20.41-30.57 2.8-14.08 16.49-23.22 30.57-20.42C364.7 12.15 415.7 43.46 452.37 87.2c36.04 42.99 58.22 98.1 59.62 158.42.28 14.3-11.09 26.13-25.39 26.41-14.3.28-26.13-11.09-26.41-25.39-1.11-47.89-18.83-91.77-47.63-126.12-29.19-34.81-69.82-59.74-116.11-69.02z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
