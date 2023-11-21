/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
'use client'
import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import Piece from './Piece';

function Board({ pieces, lobbyCode, disabled, socket }) {

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [p, setPieces] = useState(pieces);
  let flip = false;

  // Listen for changes
  useEffect(() => {
    // ensure socket exists before continuing
    if (!socket) return;
    socket.on('receive_move', (data) => {
      setPieces(data);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('receive_move');
    };
  }, []);

  const handleTileClick = (columnNumber, index) => {
    if (selectedPiece) {
      // Make a POST request to the backend
      console.log('hostname', window.location.hostname);
      fetch(`http://${window.location.hostname}:8080/api/game/${lobbyCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_pos: `${selectedPiece.columnNumber},${selectedPiece.index}`,
          new_pos: `${columnNumber},${index}`,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the backend
          setPieces(data['board']);
          setSelectedPiece(null);
          socket.emit('send_move', { room: lobbyCode, game_id: lobbyCode });
        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error(error);
        });
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
        disabled={disabled}
      >
        {p[columnNumber][index] && (
          <Piece 
            name={p[columnNumber][index]}
            isSelected={selectedPiece && selectedPiece.columnNumber === columnNumber && selectedPiece.index === index}
          />
        )}
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
