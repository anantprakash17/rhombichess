import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from '../components/Board';
import { initialGameData, rookOnly, updatedRookOnly, rookValidMoves } from './BoardTestData';

global.fetch = jest.fn();

const createMockSocket = () => {
  const events = {};

  const on = jest.fn((event, callback) => {
    events[event] = callback;
  });

  const off = jest.fn();
  const emit = jest.fn();

  const emitEvent = (event, ...args) => {
    if (events[event]) {
      events[event](...args);
    }
  };

  return {
    on, off, emit, emitEvent,
  };
};

describe('Board Component', () => {
  let mockSocket;

  function verifyPieceLocation(piece, columnIndex, cellIndex) {
    const testId = `${piece}-${columnIndex}-${cellIndex}`;
    const pieceOnTile = screen.queryByTestId(testId);
    expect(pieceOnTile).toBeInTheDocument();
  }

  function checkHighlightedTiles(moveList) {
    moveList.forEach((pos) => {
      const formattedPos = pos.replace(',', '-');
      const possibleMoveTile = screen.getByTestId(`highlighted-${formattedPos}`);
      expect(possibleMoveTile).toBeInTheDocument();
    });
  }

  function checkNotHighlightedTiles(moveList) {
    moveList.forEach((pos) => {
      const formattedPos = pos.replace(',', '-');
      const possibleMoveTile = screen.getByTestId(`${formattedPos}`);
      expect(possibleMoveTile).toBeInTheDocument();
    });
  }

  it('displays all pieces in default starting state', () => {
    render(<Board initialGameData={initialGameData} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="white" />);

    verifyPieceLocation('soldier-black', 0, 5);
    verifyPieceLocation('soldier-white', 0, 15);
    verifyPieceLocation('bishop-black', 1, 4);
    verifyPieceLocation('pawn-black', 1, 5);
    verifyPieceLocation('pawn-white', 1, 14);
    verifyPieceLocation('bishop-white', 1, 15);

    verifyPieceLocation('elephant-black', 2, 4);
    verifyPieceLocation('pawn-black', 2, 6);
    verifyPieceLocation('pawn-white', 2, 14);
    verifyPieceLocation('elephant-white', 2, 16);

    verifyPieceLocation('bishop-black', 3, 3);
    verifyPieceLocation('dog-black', 3, 4);
    verifyPieceLocation('pawn-black', 3, 5);
    verifyPieceLocation('pawn-white', 3, 14);
    verifyPieceLocation('dog-white', 3, 15);
    verifyPieceLocation('bishop-white', 3, 16);

    verifyPieceLocation('prince-black', 4, 3);
    verifyPieceLocation('soldier-black', 4, 5);
    verifyPieceLocation('soldier-white', 4, 15);
    verifyPieceLocation('prince-white', 4, 17);

    verifyPieceLocation('rook-black', 5, 2);
    verifyPieceLocation('shield-black', 5, 3);
    verifyPieceLocation('cat-black', 5, 4);
    verifyPieceLocation('pawn-black', 5, 5);
    verifyPieceLocation('pawn-white', 5, 14);
    verifyPieceLocation('cat-white', 5, 15);
    verifyPieceLocation('shield-white', 5, 16);
    verifyPieceLocation('rook-white', 5, 17);

    verifyPieceLocation('hawk-black', 6, 2);
    verifyPieceLocation('dog-black', 6, 4);
    verifyPieceLocation('pawn-black', 6, 6);
    verifyPieceLocation('pawn-white', 6, 14);
    verifyPieceLocation('dog-white', 6, 16);
    verifyPieceLocation('hawk-white', 6, 18);

    verifyPieceLocation('king-black', 7, 1);
    verifyPieceLocation('jester-black', 7, 2);
    verifyPieceLocation('machine-black', 7, 3);
    verifyPieceLocation('knight-black', 7, 4);
    verifyPieceLocation('pawn-black', 7, 5);
    verifyPieceLocation('pawn-white', 7, 14);
    verifyPieceLocation('knight-white', 7, 15);
    verifyPieceLocation('machine-white', 7, 16);
    verifyPieceLocation('jester-white', 7, 17);
    verifyPieceLocation('king-white', 7, 18);

    verifyPieceLocation('jester-black', 8, 1);
    verifyPieceLocation('cat-black', 8, 3);
    verifyPieceLocation('soldier-black', 8, 5);
    verifyPieceLocation('soldier-white', 8, 15);
    verifyPieceLocation('cat-white', 8, 17);
    verifyPieceLocation('jester-white', 8, 19);

    verifyPieceLocation('queen-black', 9, 1);
    verifyPieceLocation('jester-black', 9, 2);
    verifyPieceLocation('machine-black', 9, 3);
    verifyPieceLocation('knight-black', 9, 4);
    verifyPieceLocation('pawn-black', 9, 5);
    verifyPieceLocation('pawn-white', 9, 14);
    verifyPieceLocation('knight-white', 9, 15);
    verifyPieceLocation('machine-white', 9, 16);
    verifyPieceLocation('jester-white', 9, 17);
    verifyPieceLocation('queen-white', 9, 18);

    verifyPieceLocation('mammoth-black', 10, 2);
    verifyPieceLocation('shield-black', 10, 4);
    verifyPieceLocation('pawn-black', 10, 6);
    verifyPieceLocation('pawn-white', 10, 14);
    verifyPieceLocation('shield-white', 10, 16);
    verifyPieceLocation('mammoth-white', 10, 18);

    verifyPieceLocation('rook-black', 11, 2);
    verifyPieceLocation('dog-black', 11, 3);
    verifyPieceLocation('cat-black', 11, 4);
    verifyPieceLocation('pawn-black', 11, 5);
    verifyPieceLocation('pawn-white', 11, 14);
    verifyPieceLocation('cat-white', 11, 15);
    verifyPieceLocation('dog-white', 11, 16);
    verifyPieceLocation('rook-white', 11, 17);

    verifyPieceLocation('prince-black', 12, 3);
    verifyPieceLocation('soldier-black', 12, 5);
    verifyPieceLocation('soldier-white', 12, 15);
    verifyPieceLocation('prince-white', 12, 17);

    verifyPieceLocation('elephant-black', 13, 3);
    verifyPieceLocation('shield-black', 13, 4);
    verifyPieceLocation('pawn-black', 13, 5);
    verifyPieceLocation('pawn-white', 13, 14);
    verifyPieceLocation('shield-white', 13, 15);
    verifyPieceLocation('elephant-white', 13, 16);

    verifyPieceLocation('bishop-black', 14, 4);
    verifyPieceLocation('pawn-black', 14, 6);
    verifyPieceLocation('pawn-white', 14, 14);
    verifyPieceLocation('bishop-white', 14, 16);

    verifyPieceLocation('elephant-black', 15, 4);
    verifyPieceLocation('pawn-black', 15, 5);
    verifyPieceLocation('pawn-white', 15, 14);
    verifyPieceLocation('elephant-white', 15, 15);

    verifyPieceLocation('soldier-black', 16, 5);
    verifyPieceLocation('soldier-white', 16, 15);
  });

  it('makes valid move with the rook piece', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="white" />);

    const whiteRook = screen.queryByTestId('rook-white-5-17');
    fireEvent.click(whiteRook);

    checkHighlightedTiles(rookValidMoves['5,17']);

    const emptyTile = screen.queryByTestId('highlighted-5-15');
    fireEvent.click(emptyTile);

    const confirmMoveHeader = screen.getByText(/Confirm move?/i);
    expect(confirmMoveHeader).toBeVisible();
    const confirmMoveButton = screen.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmMoveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/game/4ZP6A'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_pos: '5,17',
          new_pos: '5,15',
        }),
      });
    });

    mockSocket.emitEvent('game_data', updatedRookOnly);

    await waitFor(() => {
      const whiteRookNew = screen.queryByTestId('rook-white-5-15');
      expect(whiteRookNew).toBeInTheDocument();
    });
  });

  it('cancel rook move', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="white" />);

    const whiteRook = screen.queryByTestId('rook-white-5-17');
    fireEvent.click(whiteRook);

    checkHighlightedTiles(rookValidMoves['5,17']);

    const emptyTile = screen.queryByTestId('highlighted-5-15');
    fireEvent.click(emptyTile);

    const confirmMoveHeader = screen.getByText(/Confirm move?/i);
    expect(confirmMoveHeader).toBeVisible();
    const cancelMoveButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelMoveButton);

    await waitFor(() => {
      expect(whiteRook).toBeInTheDocument();
    });
  });

  it('ensure when its blacks turn a white piece cannot be clicked', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="black" />);

    const whiteRook = screen.queryByTestId('rook-white-5-17');
    fireEvent.click(whiteRook);

    checkNotHighlightedTiles(rookValidMoves['5,17']);
  });

  it('ensure when its whites turn a black piece cannot be clicked', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="white" />);

    const whiteRook = screen.queryByTestId('rook-black-5-2');
    fireEvent.click(whiteRook);

    checkNotHighlightedTiles(rookValidMoves['5,2']);
  });

  it('check that if player selected white board renders with white on lower half', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={initialGameData} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="white" />);

    const whiteJester = screen.queryByTestId('jester-white-8-19');
    expect(whiteJester).toBeInTheDocument();
    const boardElement = screen.queryByTestId('board');
    expect(boardElement).not.toHaveClass('rotate-180');
  });

  it('check that if player selected black board renders with black on lower half', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={initialGameData} gameCode="4ZP6A" disabled={false} socket={mockSocket} initialColor="black" />);

    const whiteJester = screen.queryByTestId('jester-white-8-19');
    expect(whiteJester).toBeInTheDocument();
    const boardElement = screen.queryByTestId('board');
    expect(boardElement).toHaveClass('rotate-180');
  });
});
