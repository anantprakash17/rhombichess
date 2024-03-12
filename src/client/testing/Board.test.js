import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Board from '../components/Board';
import { beforeEach } from 'node:test';

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

  let mockSocket;

  const rookValidMoves = {
    '5,17': ['5,16', '5,15', '5,14', '5,13', '5,12', '5,11', '5,10', '5,9', '5,8', '5,7', '5,6', '5,5', '5,4', '5,3', '4,17', '3,16', '2,16', '1,15', '0,15', '6,18', '7,18', '8,19'],
    '5,2': ['5,3', '5,4', '5,5', '5,6', '5,7', '5,8', '5,9', '5,10', '5,11', '5,12', '5,13', '5,14', '5,15', '5,16', '4,3', '3,3', '2,4', '1,4', '0,5', '6,2', '7,1', '8,1']
  };

  const rookOnly = { board: {
    '(0, 0)': { piece: '', type: 'PADDING' },
    '(0, 1)': { piece: '', type: 'PADDING' },
    '(0, 2)': { piece: '', type: 'PADDING' },
    '(0, 3)': { piece: '', type: 'PADDING' },
    '(0, 4)': { piece: '', type: 'DIAMOND' },
    '(0, 5)': { piece: '', type: 'NORMAL' },
    '(0, 6)': { piece: '', type: 'DIAMOND' },
    '(0, 7)': { piece: '', type: 'NORMAL' },
    '(0, 8)': { piece: '', type: 'DIAMOND' },
    '(0, 9)': { piece: '', type: 'NORMAL' },
    '(0, 10)': { piece: '', type: 'DIAMOND' },
    '(0, 11)': { piece: '', type: 'NORMAL' },
    '(0, 12)': { piece: '', type: 'DIAMOND' },
    '(0, 13)': { piece: '', type: 'NORMAL' },
    '(0, 14)': { piece: '', type: 'DIAMOND' },
    '(0, 15)': { piece: '', type: 'NORMAL' },
    '(0, 16)': { piece: '', type: 'PADDING' },
    '(0, 17)': { piece: '', type: 'PADDING' },
    '(0, 18)': { piece: '', type: 'PADDING' },
    '(0, 19)': { piece: '', type: 'PADDING' },
    '(0, 20)': { piece: '', type: 'PADDING' },
    '(1, 0)': { piece: '', type: 'PADDING' },
    '(1, 1)': { piece: '', type: 'PADDING' },
    '(1, 2)': { piece: '', type: 'PADDING' },
    '(1, 3)': { piece: '', type: 'PADDING' },
    '(1, 4)': { piece: '', type: 'NORMAL' },
    '(1, 5)': { piece: '', type: 'NORMAL' },
    '(1, 6)': { piece: '', type: 'NORMAL' },
    '(1, 7)': { piece: '', type: 'NORMAL' },
    '(1, 8)': { piece: '', type: 'NORMAL' },
    '(1, 9)': { piece: '', type: 'NORMAL' },
    '(1, 10)': { piece: '', type: 'NORMAL' },
    '(1, 11)': { piece: '', type: 'NORMAL' },
    '(1, 12)': { piece: '', type: 'NORMAL' },
    '(1, 13)': { piece: '', type: 'NORMAL' },
    '(1, 14)': { piece: '', type: 'NORMAL' },
    '(1, 15)': { piece: '', type: 'NORMAL' },
    '(1, 16)': { piece: '', type: 'PADDING' },
    '(1, 17)': { piece: '', type: 'PADDING' },
    '(1, 18)': { piece: '', type: 'PADDING' },
    '(1, 19)': { piece: '', type: 'PADDING' },
    '(1, 20)': { piece: '', type: 'PADDING' },
    '(2, 0)': { piece: '', type: 'PADDING' },
    '(2, 1)': { piece: '', type: 'PADDING' },
    '(2, 2)': { piece: '', type: 'PADDING' },
    '(2, 3)': { piece: '', type: 'DIAMOND' },
    '(2, 4)': { piece: '', type: 'NORMAL' },
    '(2, 5)': { piece: '', type: 'DIAMOND' },
    '(2, 6)': { piece: '', type: 'NORMAL' },
    '(2, 7)': { piece: '', type: 'DIAMOND' },
    '(2, 8)': { piece: '', type: 'NORMAL' },
    '(2, 9)': { piece: '', type: 'DIAMOND' },
    '(2, 10)': { piece: '', type: 'NORMAL' },
    '(2, 11)': { piece: '', type: 'DIAMOND' },
    '(2, 12)': { piece: '', type: 'NORMAL' },
    '(2, 13)': { piece: '', type: 'DIAMOND' },
    '(2, 14)': { piece: '', type: 'NORMAL' },
    '(2, 15)': { piece: '', type: 'DIAMOND' },
    '(2, 16)': { piece: '', type: 'NORMAL' },
    '(2, 17)': { piece: '', type: 'PADDING' },
    '(2, 18)': { piece: '', type: 'PADDING' },
    '(2, 19)': { piece: '', type: 'PADDING' },
    '(2, 20)': { piece: '', type: 'PADDING' },
    '(3, 0)': { piece: '', type: 'PADDING' },
    '(3, 1)': { piece: '', type: 'PADDING' },
    '(3, 2)': { piece: '', type: 'PADDING' },
    '(3, 3)': { piece: '', type: 'NORMAL' },
    '(3, 4)': { piece: '', type: 'NORMAL' },
    '(3, 5)': { piece: '', type: 'NORMAL' },
    '(3, 6)': { piece: '', type: 'NORMAL' },
    '(3, 7)': { piece: '', type: 'NORMAL' },
    '(3, 8)': { piece: '', type: 'NORMAL' },
    '(3, 9)': { piece: '', type: 'NORMAL' },
    '(3, 10)': { piece: '', type: 'NORMAL' },
    '(3, 11)': { piece: '', type: 'NORMAL' },
    '(3, 12)': { piece: '', type: 'NORMAL' },
    '(3, 13)': { piece: '', type: 'NORMAL' },
    '(3, 14)': { piece: '', type: 'NORMAL' },
    '(3, 15)': { piece: '', type: 'NORMAL' },
    '(3, 16)': { piece: '', type: 'NORMAL' },
    '(3, 17)': { piece: '', type: 'PADDING' },
    '(3, 18)': { piece: '', type: 'PADDING' },
    '(3, 19)': { piece: '', type: 'PADDING' },
    '(3, 20)': { piece: '', type: 'PADDING' },
    '(4, 0)': { piece: '', type: 'PADDING' },
    '(4, 1)': { piece: '', type: 'PADDING' },
    '(4, 2)': { piece: '', type: 'DIAMOND' },
    '(4, 3)': { piece: '', type: 'NORMAL' },
    '(4, 4)': { piece: '', type: 'DIAMOND' },
    '(4, 5)': { piece: '', type: 'NORMAL' },
      '(4, 6)': { piece: '', type: 'DIAMOND' },
      '(4, 7)': { piece: '', type: 'NORMAL' },
      '(4, 8)': { piece: '', type: 'DIAMOND' },
      '(4, 9)': { piece: '', type: 'NORMAL' },
      '(4, 10)': { piece: '', type: 'DIAMOND' },
      '(4, 11)': { piece: '', type: 'NORMAL' },
      '(4, 12)': { piece: '', type: 'DIAMOND' },
      '(4, 13)': { piece: '', type: 'NORMAL' },
      '(4, 14)': { piece: '', type: 'DIAMOND' },
      '(4, 15)': { piece: '', type: 'NORMAL' },
      '(4, 16)': { piece: '', type: 'DIAMOND' },
      '(4, 17)': { piece: '', type: 'NORMAL' },
      '(4, 18)': { piece: '', type: 'PADDING' },
      '(4, 19)': { piece: '', type: 'PADDING' },
      '(4, 20)': { piece: '', type: 'PADDING' },
      '(5, 0)': { piece: '', type: 'PADDING' },
      '(5, 1)': { piece: '', type: 'PADDING' },
      '(5, 2)': { piece: 'rook-black', type: 'NORMAL' },
      '(5, 3)': { piece: '', type: 'NORMAL' },
      '(5, 4)': { piece: '', type: 'NORMAL' },
      '(5, 5)': { piece: '', type: 'NORMAL' },
      '(5, 6)': { piece: '', type: 'NORMAL' },
      '(5, 7)': { piece: '', type: 'NORMAL' },
      '(5, 8)': { piece: '', type: 'NORMAL' },
      '(5, 9)': { piece: '', type: 'NORMAL' },
      '(5, 10)': { piece: '', type: 'NORMAL' },
      '(5, 11)': { piece: '', type: 'NORMAL' },
      '(5, 12)': { piece: '', type: 'NORMAL' },
      '(5, 13)': { piece: '', type: 'NORMAL' },
      '(5, 14)': { piece: '', type: 'NORMAL' },
      '(5, 15)': { piece: '', type: 'NORMAL' },
      '(5, 16)': { piece: '', type: 'NORMAL' },
      '(5, 17)': { piece: 'rook-white', type: 'NORMAL' },
      '(5, 18)': { piece: '', type: 'PADDING' },
      '(5, 19)': { piece: '', type: 'PADDING' },
      '(5, 20)': { piece: '', type: 'PADDING' },
      '(6, 0)': { piece: '', type: 'PADDING' },
      '(6, 1)': { piece: '', type: 'DIAMOND' },
      '(6, 2)': { piece: '', type: 'NORMAL' },
      '(6, 3)': { piece: '', type: 'DIAMOND' },
      '(6, 4)': { piece: '', type: 'NORMAL' },
      '(6, 5)': { piece: '', type: 'DIAMOND' },
      '(6, 6)': { piece: '', type: 'NORMAL' },
      '(6, 7)': { piece: '', type: 'DIAMOND' },
      '(6, 8)': { piece: '', type: 'NORMAL' },
      '(6, 9)': { piece: '', type: 'DIAMOND' },
      '(6, 10)': { piece: '', type: 'NORMAL' },
      '(6, 11)': { piece: '', type: 'DIAMOND' },
      '(6, 12)': { piece: '', type: 'NORMAL' },
      '(6, 13)': { piece: '', type: 'DIAMOND' },
      '(6, 14)': { piece: '', type: 'NORMAL' },
      '(6, 15)': { piece: '', type: 'DIAMOND' },
      '(6, 16)': { piece: '', type: 'NORMAL' },
      '(6, 17)': { piece: '', type: 'DIAMOND' },
      '(6, 18)': { piece: '', type: 'NORMAL' },
      '(6, 19)': { piece: '', type: 'PADDING' },
      '(6, 20)': { piece: '', type: 'PADDING' },
      '(7, 0)': { piece: '', type: 'PADDING' },
      '(7, 1)': { piece: '', type: 'NORMAL' },
      '(7, 2)': { piece: '', type: 'NORMAL' },
      '(7, 3)': { piece: '', type: 'NORMAL' },
      '(7, 4)': { piece: '', type: 'NORMAL' },
      '(7, 5)': { piece: '', type: 'NORMAL' },
      '(7, 6)': { piece: '', type: 'NORMAL' },
      '(7, 7)': { piece: '', type: 'NORMAL' },
      '(7, 8)': { piece: '', type: 'NORMAL' },
      '(7, 9)': { piece: '', type: 'NORMAL' },
      '(7, 10)': { piece: '', type: 'NORMAL' },
      '(7, 11)': { piece: '', type: 'NORMAL' },
      '(7, 12)': { piece: '', type: 'NORMAL' },
      '(7, 13)': { piece: '', type: 'NORMAL' },
      '(7, 14)': { piece: '', type: 'NORMAL' },
      '(7, 15)': { piece: '', type: 'NORMAL' },
      '(7, 16)': { piece: '', type: 'NORMAL' },
      '(7, 17)': { piece: '', type: 'NORMAL' },
      '(7, 18)': { piece: '', type: 'NORMAL' },
      '(7, 19)': { piece: '', type: 'PADDING' },
      '(7, 20)': { piece: '', type: 'PADDING' },
      '(8, 0)': { piece: '', type: 'DIAMOND' },
      '(8, 1)': { piece: '', type: 'NORMAL' },
      '(8, 2)': { piece: '', type: 'DIAMOND' },
      '(8, 3)': { piece: '', type: 'NORMAL' },
      '(8, 4)': { piece: '', type: 'DIAMOND' },
      '(8, 5)': { piece: '', type: 'NORMAL' },
      '(8, 6)': { piece: '', type: 'DIAMOND' },
      '(8, 7)': { piece: '', type: 'NORMAL' },
      '(8, 8)': { piece: '', type: 'DIAMOND' },
      '(8, 9)': { piece: '', type: 'NORMAL' },
      '(8, 10)': { piece: '', type: 'DIAMOND' },
      '(8, 11)': { piece: '', type: 'NORMAL' },
      '(8, 12)': { piece: '', type: 'DIAMOND' },
      '(8, 13)': { piece: '', type: 'NORMAL' },
      '(8, 14)': { piece: '', type: 'DIAMOND' },
      '(8, 15)': { piece: '', type: 'NORMAL' },
      '(8, 16)': { piece: '', type: 'DIAMOND' },
      '(8, 17)': { piece: '', type: 'NORMAL' },
      '(8, 18)': { piece: '', type: 'DIAMOND' },
      '(8, 19)': { piece: '', type: 'NORMAL' },
      '(8, 20)': { piece: '', type: 'PADDING' },
      '(9, 0)': { piece: '', type: 'PADDING' },
      '(9, 1)': { piece: '', type: 'NORMAL' },
      '(9, 2)': { piece: '', type: 'NORMAL' },
      '(9, 3)': { piece: '', type: 'NORMAL' },
      '(9, 4)': { piece: '', type: 'NORMAL' },
      '(9, 5)': { piece: '', type: 'NORMAL' },
      '(9, 6)': { piece: '', type: 'NORMAL' },
      '(9, 7)': { piece: '', type: 'NORMAL' },
      '(9, 8)': { piece: '', type: 'NORMAL' },
      '(9, 9)': { piece: '', type: 'NORMAL' },
      '(9, 10)': { piece: '', type: 'NORMAL' },
      '(9, 11)': { piece: '', type: 'NORMAL' },
      '(9, 12)': { piece: '', type: 'NORMAL' },
      '(9, 13)': { piece: '', type: 'NORMAL' },
      '(9, 14)': { piece: '', type: 'NORMAL' },
      '(9, 15)': { piece: '', type: 'NORMAL' },
      '(9, 16)': { piece: '', type: 'NORMAL' },
      '(9, 17)': { piece: '', type: 'NORMAL' },
      '(9, 18)': { piece: '', type: 'NORMAL' },
      '(9, 19)': { piece: '', type: 'PADDING' },
      '(9, 20)': { piece: '', type: 'PADDING' },
      '(10, 0)': { piece: '', type: 'PADDING' },
      '(10, 1)': { piece: '', type: 'DIAMOND' },
      '(10, 2)': { piece: '', type: 'NORMAL' },
      '(10, 3)': { piece: '', type: 'DIAMOND' },
      '(10, 4)': { piece: '', type: 'NORMAL' },
      '(10, 5)': { piece: '', type: 'DIAMOND' },
      '(10, 6)': { piece: '', type: 'NORMAL' },
      '(10, 7)': { piece: '', type: 'DIAMOND' },
      '(10, 8)': { piece: '', type: 'NORMAL' },
      '(10, 9)': { piece: '', type: 'DIAMOND' },
      '(10, 10)': { piece: '', type: 'NORMAL' },
      '(10, 11)': { piece: '', type: 'DIAMOND' },
      '(10, 12)': { piece: '', type: 'NORMAL' },
      '(10, 13)': { piece: '', type: 'DIAMOND' },
      '(10, 14)': { piece: '', type: 'NORMAL' },
      '(10, 15)': { piece: '', type: 'DIAMOND' },
      '(10, 16)': { piece: '', type: 'NORMAL' },
      '(10, 17)': { piece: '', type: 'DIAMOND' },
      '(10, 18)': { piece: '', type: 'NORMAL' },
      '(10, 19)': { piece: '', type: 'PADDING' },
      '(10, 20)': { piece: '', type: 'PADDING' },
      '(11, 0)': { piece: '', type: 'PADDING' },
      '(11, 1)': { piece: '', type: 'PADDING' },
      '(11, 2)': { piece: '', type: 'NORMAL' },
      '(11, 3)': { piece: '', type: 'NORMAL' },
      '(11, 4)': { piece: '', type: 'NORMAL' },
      '(11, 5)': { piece: '', type: 'NORMAL' },
      '(11, 6)': { piece: '', type: 'NORMAL' },
      '(11, 7)': { piece: '', type: 'NORMAL' },
      '(11, 8)': { piece: '', type: 'NORMAL' },
      '(11, 9)': { piece: '', type: 'NORMAL' },
      '(11, 10)': { piece: '', type: 'NORMAL' },
      '(11, 11)': { piece: '', type: 'NORMAL' },
      '(11, 12)': { piece: '', type: 'NORMAL' },
      '(11, 13)': { piece: '', type: 'NORMAL' },
      '(11, 14)': { piece: '', type: 'NORMAL' },
      '(11, 15)': { piece: '', type: 'NORMAL' },
      '(11, 16)': { piece: '', type: 'NORMAL' },
      '(11, 17)': { piece: '', type: 'NORMAL' },
      '(11, 18)': { piece: '', type: 'PADDING' },
      '(11, 19)': { piece: '', type: 'PADDING' },
      '(11, 20)': { piece: '', type: 'PADDING' },
      '(12, 0)': { piece: '', type: 'PADDING' },
      '(12, 1)': { piece: '', type: 'PADDING' },
      '(12, 2)': { piece: '', type: 'DIAMOND' },
      '(12, 3)': { piece: '', type: 'NORMAL' },
      '(12, 4)': { piece: '', type: 'DIAMOND' },
      '(12, 5)': { piece: '', type: 'NORMAL' },
      '(12, 6)': { piece: '', type: 'DIAMOND' },
      '(12, 7)': { piece: '', type: 'NORMAL' },
      '(12, 8)': { piece: '', type: 'DIAMOND' },
      '(12, 9)': { piece: '', type: 'NORMAL' },
      '(12, 10)': { piece: '', type: 'DIAMOND' },
      '(12, 11)': { piece: '', type: 'NORMAL' },
      '(12, 12)': { piece: '', type: 'DIAMOND' },
      '(12, 13)': { piece: '', type: 'NORMAL' },
      '(12, 14)': { piece: '', type: 'DIAMOND' },
      '(12, 15)': { piece: '', type: 'NORMAL' },
      '(12, 16)': { piece: '', type: 'DIAMOND' },
      '(12, 17)': { piece: '', type: 'NORMAL' },
      '(12, 18)': { piece: '', type: 'PADDING' },
      '(12, 19)': { piece: '', type: 'PADDING' },
      '(12, 20)': { piece: '', type: 'PADDING' },
      '(13, 0)': { piece: '', type: 'PADDING' },
      '(13, 1)': { piece: '', type: 'PADDING' },
      '(13, 2)': { piece: '', type: 'PADDING' },
      '(13, 3)': { piece: '', type: 'NORMAL' },
      '(13, 4)': { piece: '', type: 'NORMAL' },
      '(13, 5)': { piece: '', type: 'NORMAL' },
      '(13, 6)': { piece: '', type: 'NORMAL' },
      '(13, 7)': { piece: '', type: 'NORMAL' },
      '(13, 8)': { piece: '', type: 'NORMAL' },
      '(13, 9)': { piece: '', type: 'NORMAL' },
      '(13, 10)': { piece: '', type: 'NORMAL' },
      '(13, 11)': { piece: '', type: 'NORMAL' },
      '(13, 12)': { piece: '', type: 'NORMAL' },
      '(13, 13)': { piece: '', type: 'NORMAL' },
      '(13, 14)': { piece: '', type: 'NORMAL' },
      '(13, 15)': { piece: '', type: 'NORMAL' },
      '(13, 16)': { piece: '', type: 'NORMAL' },
      '(13, 17)': { piece: '', type: 'PADDING' },
      '(13, 18)': { piece: '', type: 'PADDING' },
      '(13, 19)': { piece: '', type: 'PADDING' },
      '(13, 20)': { piece: '', type: 'PADDING' },
      '(14, 0)': { piece: '', type: 'PADDING' },
      '(14, 1)': { piece: '', type: 'PADDING' },
      '(14, 2)': { piece: '', type: 'PADDING' },
      '(14, 3)': { piece: '', type: 'DIAMOND' },
      '(14, 4)': { piece: '', type: 'NORMAL' },
      '(14, 5)': { piece: '', type: 'DIAMOND' },
      '(14, 6)': { piece: '', type: 'NORMAL' },
      '(14, 7)': { piece: '', type: 'DIAMOND' },
      '(14, 8)': { piece: '', type: 'NORMAL' },
      '(14, 9)': { piece: '', type: 'DIAMOND' },
      '(14, 10)': { piece: '', type: 'NORMAL' },
      '(14, 11)': { piece: '', type: 'DIAMOND' },
      '(14, 12)': { piece: '', type: 'NORMAL' },
      '(14, 13)': { piece: '', type: 'DIAMOND' },
      '(14, 14)': { piece: '', type: 'NORMAL' },
      '(14, 15)': { piece: '', type: 'DIAMOND' },
      '(14, 16)': { piece: '', type: 'NORMAL' },
      '(14, 17)': { piece: '', type: 'PADDING' },
      '(14, 18)': { piece: '', type: 'PADDING' },
      '(14, 19)': { piece: '', type: 'PADDING' },
      '(14, 20)': { piece: '', type: 'PADDING' },
      '(15, 0)': { piece: '', type: 'PADDING' },
      '(15, 1)': { piece: '', type: 'PADDING' },
      '(15, 2)': { piece: '', type: 'PADDING' },
      '(15, 3)': { piece: '', type: 'PADDING' },
      '(15, 4)': { piece: '', type: 'NORMAL' },
      '(15, 5)': { piece: '', type: 'NORMAL' },
      '(15, 6)': { piece: '', type: 'NORMAL' },
      '(15, 7)': { piece: '', type: 'NORMAL' },
      '(15, 8)': { piece: '', type: 'NORMAL' },
      '(15, 9)': { piece: '', type: 'NORMAL' },
      '(15, 10)': { piece: '', type: 'NORMAL' },
      '(15, 11)': { piece: '', type: 'NORMAL' },
      '(15, 12)': { piece: '', type: 'NORMAL' },
      '(15, 13)': { piece: '', type: 'NORMAL' },
      '(15, 14)': { piece: '', type: 'NORMAL' },
      '(15, 15)': { piece: '', type: 'NORMAL' },
      '(15, 16)': { piece: '', type: 'PADDING' },
      '(15, 17)': { piece: '', type: 'PADDING' },
      '(15, 18)': { piece: '', type: 'PADDING' },
      '(15, 19)': { piece: '', type: 'PADDING' },
      '(15, 20)': { piece: '', type: 'PADDING' },
      '(16, 0)': { piece: '', type: 'PADDING' },
      '(16, 1)': { piece: '', type: 'PADDING' },
      '(16, 2)': { piece: '', type: 'PADDING' },
      '(16, 3)': { piece: '', type: 'PADDING' },
      '(16, 4)': { piece: '', type: 'DIAMOND' },
      '(16, 5)': { piece: '', type: 'NORMAL' },
      '(16, 6)': { piece: '', type: 'DIAMOND' },
      '(16, 7)': { piece: '', type: 'NORMAL' },
      '(16, 8)': { piece: '', type: 'DIAMOND' },
      '(16, 9)': { piece: '', type: 'NORMAL' },
      '(16, 10)': { piece: '', type: 'DIAMOND' },
      '(16, 11)': { piece: '', type: 'NORMAL' },
      '(16, 12)': { piece: '', type: 'DIAMOND' },
      '(16, 13)': { piece: '', type: 'NORMAL' },
      '(16, 14)': { piece: '', type: 'DIAMOND' },
      '(16, 15)': { piece: '', type: 'NORMAL' },
      '(16, 16)': { piece: '', type: 'PADDING' },
      '(16, 17)': { piece: '', type: 'PADDING' },
      '(16, 18)': { piece: '', type: 'PADDING' },
      '(16, 19)': { piece: '', type: 'PADDING' },
      '(16, 20)': { piece: '', type: 'PADDING' },    
    }, valid_moves: rookValidMoves, turn: 'white'};

    const initialGameData = { board: {
        '(0, 0)': { piece: '', type: 'PADDING' },
        '(0, 1)': { piece: '', type: 'PADDING' },
        '(0, 2)': { piece: '', type: 'PADDING' },
        '(0, 3)': { piece: '', type: 'PADDING' },
        '(0, 4)': { piece: '', type: 'DIAMOND' },
        '(0, 5)': { piece: 'soldier-black', type: 'NORMAL' },
        '(0, 6)': { piece: '', type: 'DIAMOND' },
        '(0, 7)': { piece: '', type: 'NORMAL' },
        '(0, 8)': { piece: '', type: 'DIAMOND' },
        '(0, 9)': { piece: '', type: 'NORMAL' },
        '(0, 10)': { piece: '', type: 'DIAMOND' },
        '(0, 11)': { piece: '', type: 'NORMAL' },
        '(0, 12)': { piece: '', type: 'DIAMOND' },
        '(0, 13)': { piece: '', type: 'NORMAL' },
        '(0, 14)': { piece: '', type: 'DIAMOND' },
        '(0, 15)': { piece: 'soldier-white', type: 'NORMAL' },
        '(0, 16)': { piece: '', type: 'PADDING' },
        '(0, 17)': { piece: '', type: 'PADDING' },
        '(0, 18)': { piece: '', type: 'PADDING' },
        '(0, 19)': { piece: '', type: 'PADDING' },
        '(0, 20)': { piece: '', type: 'PADDING' },
        '(1, 0)': { piece: '', type: 'PADDING' },
        '(1, 1)': { piece: '', type: 'PADDING' },
        '(1, 2)': { piece: '', type: 'PADDING' },
        '(1, 3)': { piece: '', type: 'PADDING' },
        '(1, 4)': { piece: 'bishop-black', type: 'NORMAL' },
        '(1, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(1, 6)': { piece: '', type: 'NORMAL' },
        '(1, 7)': { piece: '', type: 'NORMAL' },
        '(1, 8)': { piece: '', type: 'NORMAL' },
        '(1, 9)': { piece: '', type: 'NORMAL' },
        '(1, 10)': { piece: '', type: 'NORMAL' },
        '(1, 11)': { piece: '', type: 'NORMAL' },
        '(1, 12)': { piece: '', type: 'NORMAL' },
        '(1, 13)': { piece: '', type: 'NORMAL' },
        '(1, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(1, 15)': { piece: 'bishop-white', type: 'NORMAL' },
        '(1, 16)': { piece: '', type: 'PADDING' },
        '(1, 17)': { piece: '', type: 'PADDING' },
        '(1, 18)': { piece: '', type: 'PADDING' },
        '(1, 19)': { piece: '', type: 'PADDING' },
        '(1, 20)': { piece: '', type: 'PADDING' },
        '(2, 0)': { piece: '', type: 'PADDING' },
        '(2, 1)': { piece: '', type: 'PADDING' },
        '(2, 2)': { piece: '', type: 'PADDING' },
        '(2, 3)': { piece: '', type: 'DIAMOND' },
        '(2, 4)': { piece: 'elephant-black', type: 'NORMAL' },
        '(2, 5)': { piece: '', type: 'DIAMOND' },
        '(2, 6)': { piece: 'pawn-black', type: 'NORMAL' },
        '(2, 7)': { piece: '', type: 'DIAMOND' },
        '(2, 8)': { piece: '', type: 'NORMAL' },
        '(2, 9)': { piece: '', type: 'DIAMOND' },
        '(2, 10)': { piece: '', type: 'NORMAL' },
        '(2, 11)': { piece: '', type: 'DIAMOND' },
        '(2, 12)': { piece: '', type: 'NORMAL' },
        '(2, 13)': { piece: '', type: 'DIAMOND' },
        '(2, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(2, 15)': { piece: '', type: 'DIAMOND' },
        '(2, 16)': { piece: 'elephant-white', type: 'NORMAL' },
        '(2, 17)': { piece: '', type: 'PADDING' },
        '(2, 18)': { piece: '', type: 'PADDING' },
        '(2, 19)': { piece: '', type: 'PADDING' },
        '(2, 20)': { piece: '', type: 'PADDING' },
        '(3, 0)': { piece: '', type: 'PADDING' },
        '(3, 1)': { piece: '', type: 'PADDING' },
        '(3, 2)': { piece: '', type: 'PADDING' },
        '(3, 3)': { piece: 'bishop-black', type: 'NORMAL' },
        '(3, 4)': { piece: 'dog-black', type: 'NORMAL' },
        '(3, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(3, 6)': { piece: '', type: 'NORMAL' },
        '(3, 7)': { piece: '', type: 'NORMAL' },
        '(3, 8)': { piece: '', type: 'NORMAL' },
        '(3, 9)': { piece: '', type: 'NORMAL' },
        '(3, 10)': { piece: '', type: 'NORMAL' },
        '(3, 11)': { piece: '', type: 'NORMAL' },
        '(3, 12)': { piece: '', type: 'NORMAL' },
        '(3, 13)': { piece: '', type: 'NORMAL' },
        '(3, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(3, 15)': { piece: 'dog-white', type: 'NORMAL' },
        '(3, 16)': { piece: 'bishop-white', type: 'NORMAL' },
        '(3, 17)': { piece: '', type: 'PADDING' },
        '(3, 18)': { piece: '', type: 'PADDING' },
        '(3, 19)': { piece: '', type: 'PADDING' },
        '(3, 20)': { piece: '', type: 'PADDING' },
        '(4, 0)': { piece: '', type: 'PADDING' },
        '(4, 1)': { piece: '', type: 'PADDING' },
        '(4, 2)': { piece: '', type: 'DIAMOND' },
        '(4, 3)': { piece: 'prince-black', type: 'NORMAL' },
        '(4, 4)': { piece: '', type: 'DIAMOND' },
        '(4, 5)': { piece: 'soldier-black', type: 'NORMAL' },
        '(4, 6)': { piece: '', type: 'DIAMOND' },
        '(4, 7)': { piece: '', type: 'NORMAL' },
        '(4, 8)': { piece: '', type: 'DIAMOND' },
        '(4, 9)': { piece: '', type: 'NORMAL' },
        '(4, 10)': { piece: '', type: 'DIAMOND' },
        '(4, 11)': { piece: '', type: 'NORMAL' },
        '(4, 12)': { piece: '', type: 'DIAMOND' },
        '(4, 13)': { piece: '', type: 'NORMAL' },
        '(4, 14)': { piece: '', type: 'DIAMOND' },
        '(4, 15)': { piece: 'soldier-white', type: 'NORMAL' },
        '(4, 16)': { piece: '', type: 'DIAMOND' },
        '(4, 17)': { piece: 'prince-white', type: 'NORMAL' },
        '(4, 18)': { piece: '', type: 'PADDING' },
        '(4, 19)': { piece: '', type: 'PADDING' },
        '(4, 20)': { piece: '', type: 'PADDING' },
        '(5, 0)': { piece: '', type: 'PADDING' },
        '(5, 1)': { piece: '', type: 'PADDING' },
        '(5, 2)': { piece: 'rook-black', type: 'NORMAL' },
        '(5, 3)': { piece: 'shield-black', type: 'NORMAL' },
        '(5, 4)': { piece: 'cat-black', type: 'NORMAL' },
        '(5, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(5, 6)': { piece: '', type: 'NORMAL' },
        '(5, 7)': { piece: '', type: 'NORMAL' },
        '(5, 8)': { piece: '', type: 'NORMAL' },
        '(5, 9)': { piece: '', type: 'NORMAL' },
        '(5, 10)': { piece: '', type: 'NORMAL' },
        '(5, 11)': { piece: '', type: 'NORMAL' },
        '(5, 12)': { piece: '', type: 'NORMAL' },
        '(5, 13)': { piece: '', type: 'NORMAL' },
        '(5, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(5, 15)': { piece: 'cat-white', type: 'NORMAL' },
        '(5, 16)': { piece: 'shield-white', type: 'NORMAL' },
        '(5, 17)': { piece: 'rook-white', type: 'NORMAL' },
        '(5, 18)': { piece: '', type: 'PADDING' },
        '(5, 19)': { piece: '', type: 'PADDING' },
        '(5, 20)': { piece: '', type: 'PADDING' },
        '(6, 0)': { piece: '', type: 'PADDING' },
        '(6, 1)': { piece: '', type: 'DIAMOND' },
        '(6, 2)': { piece: 'hawk-black', type: 'NORMAL' },
        '(6, 3)': { piece: '', type: 'DIAMOND' },
        '(6, 4)': { piece: 'dog-black', type: 'NORMAL' },
        '(6, 5)': { piece: '', type: 'DIAMOND' },
        '(6, 6)': { piece: 'pawn-black', type: 'NORMAL' },
        '(6, 7)': { piece: '', type: 'DIAMOND' },
        '(6, 8)': { piece: '', type: 'NORMAL' },
        '(6, 9)': { piece: '', type: 'DIAMOND' },
        '(6, 10)': { piece: '', type: 'NORMAL' },
        '(6, 11)': { piece: '', type: 'DIAMOND' },
        '(6, 12)': { piece: '', type: 'NORMAL' },
        '(6, 13)': { piece: '', type: 'DIAMOND' },
        '(6, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(6, 15)': { piece: '', type: 'DIAMOND' },
        '(6, 16)': { piece: 'dog-white', type: 'NORMAL' },
        '(6, 17)': { piece: '', type: 'DIAMOND' },
        '(6, 18)': { piece: 'hawk-white', type: 'NORMAL' },
        '(6, 19)': { piece: '', type: 'PADDING' },
        '(6, 20)': { piece: '', type: 'PADDING' },
        '(7, 0)': { piece: '', type: 'PADDING' },
        '(7, 1)': { piece: 'king-black', type: 'NORMAL' },
        '(7, 2)': { piece: 'jester-black', type: 'NORMAL' },
        '(7, 3)': { piece: 'machine-black', type: 'NORMAL' },
        '(7, 4)': { piece: 'knight-black', type: 'NORMAL' },
        '(7, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(7, 6)': { piece: '', type: 'NORMAL' },
        '(7, 7)': { piece: '', type: 'NORMAL' },
        '(7, 8)': { piece: '', type: 'NORMAL' },
        '(7, 9)': { piece: '', type: 'NORMAL' },
        '(7, 10)': { piece: '', type: 'NORMAL' },
        '(7, 11)': { piece: '', type: 'NORMAL' },
        '(7, 12)': { piece: '', type: 'NORMAL' },
        '(7, 13)': { piece: '', type: 'NORMAL' },
        '(7, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(7, 15)': { piece: 'knight-white', type: 'NORMAL' },
        '(7, 16)': { piece: 'machine-white', type: 'NORMAL' },
        '(7, 17)': { piece: 'jester-white', type: 'NORMAL' },
        '(7, 18)': { piece: 'king-white', type: 'NORMAL' },
        '(7, 19)': { piece: '', type: 'PADDING' },
        '(7, 20)': { piece: '', type: 'PADDING' },
        '(8, 0)': { piece: '', type: 'DIAMOND' },
        '(8, 1)': { piece: 'jester-black', type: 'NORMAL' },
        '(8, 2)': { piece: '', type: 'DIAMOND' },
        '(8, 3)': { piece: 'cat-black', type: 'NORMAL' },
        '(8, 4)': { piece: '', type: 'DIAMOND' },
        '(8, 5)': { piece: 'soldier-black', type: 'NORMAL' },
        '(8, 6)': { piece: '', type: 'DIAMOND' },
        '(8, 7)': { piece: '', type: 'NORMAL' },
        '(8, 8)': { piece: '', type: 'DIAMOND' },
        '(8, 9)': { piece: '', type: 'NORMAL' },
        '(8, 10)': { piece: '', type: 'DIAMOND' },
        '(8, 11)': { piece: '', type: 'NORMAL' },
        '(8, 12)': { piece: '', type: 'DIAMOND' },
        '(8, 13)': { piece: '', type: 'NORMAL' },
        '(8, 14)': { piece: '', type: 'DIAMOND' },
        '(8, 15)': { piece: 'soldier-white', type: 'NORMAL' },
        '(8, 16)': { piece: '', type: 'DIAMOND' },
        '(8, 17)': { piece: 'cat-white', type: 'NORMAL' },
        '(8, 18)': { piece: '', type: 'DIAMOND' },
        '(8, 19)': { piece: 'jester-white', type: 'NORMAL' },
        '(8, 20)': { piece: '', type: 'PADDING' },
        '(9, 0)': { piece: '', type: 'PADDING' },
        '(9, 1)': { piece: 'queen-black', type: 'NORMAL' },
        '(9, 2)': { piece: 'jester-black', type: 'NORMAL' },
        '(9, 3)': { piece: 'machine-black', type: 'NORMAL' },
        '(9, 4)': { piece: 'knight-black', type: 'NORMAL' },
        '(9, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(9, 6)': { piece: '', type: 'NORMAL' },
        '(9, 7)': { piece: '', type: 'NORMAL' },
        '(9, 8)': { piece: '', type: 'NORMAL' },
        '(9, 9)': { piece: '', type: 'NORMAL' },
        '(9, 10)': { piece: '', type: 'NORMAL' },
        '(9, 11)': { piece: '', type: 'NORMAL' },
        '(9, 12)': { piece: '', type: 'NORMAL' },
        '(9, 13)': { piece: '', type: 'NORMAL' },
        '(9, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(9, 15)': { piece: 'knight-white', type: 'NORMAL' },
        '(9, 16)': { piece: 'machine-white', type: 'NORMAL' },
        '(9, 17)': { piece: 'jester-white', type: 'NORMAL' },
        '(9, 18)': { piece: 'queen-white', type: 'NORMAL' },
        '(9, 19)': { piece: '', type: 'PADDING' },
        '(9, 20)': { piece: '', type: 'PADDING' },
        '(10, 0)': { piece: '', type: 'PADDING' },
        '(10, 1)': { piece: '', type: 'DIAMOND' },
        '(10, 2)': { piece: 'mammoth-black', type: 'NORMAL' },
        '(10, 3)': { piece: '', type: 'DIAMOND' },
        '(10, 4)': { piece: 'shield-black', type: 'NORMAL' },
        '(10, 5)': { piece: '', type: 'DIAMOND' },
        '(10, 6)': { piece: 'pawn-black', type: 'NORMAL' },
        '(10, 7)': { piece: '', type: 'DIAMOND' },
        '(10, 8)': { piece: '', type: 'NORMAL' },
        '(10, 9)': { piece: '', type: 'DIAMOND' },
        '(10, 10)': { piece: '', type: 'NORMAL' },
        '(10, 11)': { piece: '', type: 'DIAMOND' },
        '(10, 12)': { piece: '', type: 'NORMAL' },
        '(10, 13)': { piece: '', type: 'DIAMOND' },
        '(10, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(10, 15)': { piece: '', type: 'DIAMOND' },
        '(10, 16)': { piece: 'shield-white', type: 'NORMAL' },
        '(10, 17)': { piece: '', type: 'DIAMOND' },
        '(10, 18)': { piece: 'mammoth-white', type: 'NORMAL' },
        '(10, 19)': { piece: '', type: 'PADDING' },
        '(10, 20)': { piece: '', type: 'PADDING' },
        '(11, 0)': { piece: '', type: 'PADDING' },
        '(11, 1)': { piece: '', type: 'PADDING' },
        '(11, 2)': { piece: 'rook-black', type: 'NORMAL' },
        '(11, 3)': { piece: 'dog-black', type: 'NORMAL' },
        '(11, 4)': { piece: 'cat-black', type: 'NORMAL' },
        '(11, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(11, 6)': { piece: '', type: 'NORMAL' },
        '(11, 7)': { piece: '', type: 'NORMAL' },
        '(11, 8)': { piece: '', type: 'NORMAL' },
        '(11, 9)': { piece: '', type: 'NORMAL' },
        '(11, 10)': { piece: '', type: 'NORMAL' },
        '(11, 11)': { piece: '', type: 'NORMAL' },
        '(11, 12)': { piece: '', type: 'NORMAL' },
        '(11, 13)': { piece: '', type: 'NORMAL' },
        '(11, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(11, 15)': { piece: 'cat-white', type: 'NORMAL' },
        '(11, 16)': { piece: 'dog-white', type: 'NORMAL' },
        '(11, 17)': { piece: 'rook-white', type: 'NORMAL' },
        '(11, 18)': { piece: '', type: 'PADDING' },
        '(11, 19)': { piece: '', type: 'PADDING' },
        '(11, 20)': { piece: '', type: 'PADDING' },
        '(12, 0)': { piece: '', type: 'PADDING' },
        '(12, 1)': { piece: '', type: 'PADDING' },
        '(12, 2)': { piece: '', type: 'DIAMOND' },
        '(12, 3)': { piece: 'prince-black', type: 'NORMAL' },
        '(12, 4)': { piece: '', type: 'DIAMOND' },
        '(12, 5)': { piece: 'soldier-black', type: 'NORMAL' },
        '(12, 6)': { piece: '', type: 'DIAMOND' },
        '(12, 7)': { piece: '', type: 'NORMAL' },
        '(12, 8)': { piece: '', type: 'DIAMOND' },
        '(12, 9)': { piece: '', type: 'NORMAL' },
        '(12, 10)': { piece: '', type: 'DIAMOND' },
        '(12, 11)': { piece: '', type: 'NORMAL' },
        '(12, 12)': { piece: '', type: 'DIAMOND' },
        '(12, 13)': { piece: '', type: 'NORMAL' },
        '(12, 14)': { piece: '', type: 'DIAMOND' },
        '(12, 15)': { piece: 'soldier-white', type: 'NORMAL' },
        '(12, 16)': { piece: '', type: 'DIAMOND' },
        '(12, 17)': { piece: 'prince-white', type: 'NORMAL' },
        '(12, 18)': { piece: '', type: 'PADDING' },
        '(12, 19)': { piece: '', type: 'PADDING' },
        '(12, 20)': { piece: '', type: 'PADDING' },
        '(13, 0)': { piece: '', type: 'PADDING' },
        '(13, 1)': { piece: '', type: 'PADDING' },
        '(13, 2)': { piece: '', type: 'PADDING' },
        '(13, 3)': { piece: 'elephant-black', type: 'NORMAL' },
        '(13, 4)': { piece: 'shield-black', type: 'NORMAL' },
        '(13, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(13, 6)': { piece: '', type: 'NORMAL' },
        '(13, 7)': { piece: '', type: 'NORMAL' },
        '(13, 8)': { piece: '', type: 'NORMAL' },
        '(13, 9)': { piece: '', type: 'NORMAL' },
        '(13, 10)': { piece: '', type: 'NORMAL' },
        '(13, 11)': { piece: '', type: 'NORMAL' },
        '(13, 12)': { piece: '', type: 'NORMAL' },
        '(13, 13)': { piece: '', type: 'NORMAL' },
        '(13, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(13, 15)': { piece: 'shield-white', type: 'NORMAL' },
        '(13, 16)': { piece: 'elephant-white', type: 'NORMAL' },
        '(13, 17)': { piece: '', type: 'PADDING' },
        '(13, 18)': { piece: '', type: 'PADDING' },
        '(13, 19)': { piece: '', type: 'PADDING' },
        '(13, 20)': { piece: '', type: 'PADDING' },
        '(14, 0)': { piece: '', type: 'PADDING' },
        '(14, 1)': { piece: '', type: 'PADDING' },
        '(14, 2)': { piece: '', type: 'PADDING' },
        '(14, 3)': { piece: '', type: 'DIAMOND' },
        '(14, 4)': { piece: 'bishop-black', type: 'NORMAL' },
        '(14, 5)': { piece: '', type: 'DIAMOND' },
        '(14, 6)': { piece: 'pawn-black', type: 'NORMAL' },
        '(14, 7)': { piece: '', type: 'DIAMOND' },
        '(14, 8)': { piece: '', type: 'NORMAL' },
        '(14, 9)': { piece: '', type: 'DIAMOND' },
        '(14, 10)': { piece: '', type: 'NORMAL' },
        '(14, 11)': { piece: '', type: 'DIAMOND' },
        '(14, 12)': { piece: '', type: 'NORMAL' },
        '(14, 13)': { piece: '', type: 'DIAMOND' },
        '(14, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(14, 15)': { piece: '', type: 'DIAMOND' },
        '(14, 16)': { piece: 'bishop-white', type: 'NORMAL' },
        '(14, 17)': { piece: '', type: 'PADDING' },
        '(14, 18)': { piece: '', type: 'PADDING' },
        '(14, 19)': { piece: '', type: 'PADDING' },
        '(14, 20)': { piece: '', type: 'PADDING' },
        '(15, 0)': { piece: '', type: 'PADDING' },
        '(15, 1)': { piece: '', type: 'PADDING' },
        '(15, 2)': { piece: '', type: 'PADDING' },
        '(15, 3)': { piece: '', type: 'PADDING' },
        '(15, 4)': { piece: 'elephant-black', type: 'NORMAL' },
        '(15, 5)': { piece: 'pawn-black', type: 'NORMAL' },
        '(15, 6)': { piece: '', type: 'NORMAL' },
        '(15, 7)': { piece: '', type: 'NORMAL' },
        '(15, 8)': { piece: '', type: 'NORMAL' },
        '(15, 9)': { piece: '', type: 'NORMAL' },
        '(15, 10)': { piece: '', type: 'NORMAL' },
        '(15, 11)': { piece: '', type: 'NORMAL' },
        '(15, 12)': { piece: '', type: 'NORMAL' },
        '(15, 13)': { piece: '', type: 'NORMAL' },
        '(15, 14)': { piece: 'pawn-white', type: 'NORMAL' },
        '(15, 15)': { piece: 'elephant-white', type: 'NORMAL' },
        '(15, 16)': { piece: '', type: 'PADDING' },
        '(15, 17)': { piece: '', type: 'PADDING' },
        '(15, 18)': { piece: '', type: 'PADDING' },
        '(15, 19)': { piece: '', type: 'PADDING' },
        '(15, 20)': { piece: '', type: 'PADDING' },
        '(16, 0)': { piece: '', type: 'PADDING' },
        '(16, 1)': { piece: '', type: 'PADDING' },
        '(16, 2)': { piece: '', type: 'PADDING' },
        '(16, 3)': { piece: '', type: 'PADDING' },
        '(16, 4)': { piece: '', type: 'DIAMOND' },
        '(16, 5)': { piece: 'soldier-black', type: 'NORMAL' },
        '(16, 6)': { piece: '', type: 'DIAMOND' },
        '(16, 7)': { piece: '', type: 'NORMAL' },
        '(16, 8)': { piece: '', type: 'DIAMOND' },
        '(16, 9)': { piece: '', type: 'NORMAL' },
        '(16, 10)': { piece: '', type: 'DIAMOND' },
        '(16, 11)': { piece: '', type: 'NORMAL' },
        '(16, 12)': { piece: '', type: 'DIAMOND' },
        '(16, 13)': { piece: '', type: 'NORMAL' },
        '(16, 14)': { piece: '', type: 'DIAMOND' },
        '(16, 15)': { piece: 'soldier-white', type: 'NORMAL' },
        '(16, 16)': { piece: '', type: 'PADDING' },
        '(16, 17)': { piece: '', type: 'PADDING' },
        '(16, 18)': { piece: '', type: 'PADDING' },
        '(16, 19)': { piece: '', type: 'PADDING' },
        '(16, 20)': { piece: '', type: 'PADDING' },    
      }};

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

      const updatedRookValidMoves = {
        '5,15': ['5,14', '5,13', '5,12', '5,11', '5,10', '5,9', '5,8', '5,7', '5,6', '5,5', '5,4', '5,3', '5,16', '5,17', '4,15', '3,14', '2,14', '1,13', '0,13', '6,16', '7,16', '8,17', '9,17', '10,18'],
        '5,2': ['5,3', '5,4', '5,5', '5,6', '5,7', '5,8', '5,9', '5,10', '5,11', '5,12', '5,13', '5,14', '5,15', '5,16', '4,3', '3,3', '2,4', '1,4', '0,5', '6,2', '7,1', '8,1']
      };

      const updatedGameData = { board: {
            '(0, 0)': { piece: '', type: 'PADDING' },
      '(0, 1)': { piece: '', type: 'PADDING' },
      '(0, 2)': { piece: '', type: 'PADDING' },
      '(0, 3)': { piece: '', type: 'PADDING' },
      '(0, 4)': { piece: '', type: 'DIAMOND' },
      '(0, 5)': { piece: '', type: 'NORMAL' },
      '(0, 6)': { piece: '', type: 'DIAMOND' },
      '(0, 7)': { piece: '', type: 'NORMAL' },
      '(0, 8)': { piece: '', type: 'DIAMOND' },
      '(0, 9)': { piece: '', type: 'NORMAL' },
      '(0, 10)': { piece: '', type: 'DIAMOND' },
      '(0, 11)': { piece: '', type: 'NORMAL' },
      '(0, 12)': { piece: '', type: 'DIAMOND' },
      '(0, 13)': { piece: '', type: 'NORMAL' },
      '(0, 14)': { piece: '', type: 'DIAMOND' },
      '(0, 15)': { piece: '', type: 'NORMAL' },
      '(0, 16)': { piece: '', type: 'PADDING' },
      '(0, 17)': { piece: '', type: 'PADDING' },
      '(0, 18)': { piece: '', type: 'PADDING' },
      '(0, 19)': { piece: '', type: 'PADDING' },
      '(0, 20)': { piece: '', type: 'PADDING' },
      '(1, 0)': { piece: '', type: 'PADDING' },
      '(1, 1)': { piece: '', type: 'PADDING' },
      '(1, 2)': { piece: '', type: 'PADDING' },
      '(1, 3)': { piece: '', type: 'PADDING' },
      '(1, 4)': { piece: '', type: 'NORMAL' },
      '(1, 5)': { piece: '', type: 'NORMAL' },
      '(1, 6)': { piece: '', type: 'NORMAL' },
      '(1, 7)': { piece: '', type: 'NORMAL' },
      '(1, 8)': { piece: '', type: 'NORMAL' },
      '(1, 9)': { piece: '', type: 'NORMAL' },
      '(1, 10)': { piece: '', type: 'NORMAL' },
      '(1, 11)': { piece: '', type: 'NORMAL' },
      '(1, 12)': { piece: '', type: 'NORMAL' },
      '(1, 13)': { piece: '', type: 'NORMAL' },
      '(1, 14)': { piece: '', type: 'NORMAL' },
      '(1, 15)': { piece: '', type: 'NORMAL' },
      '(1, 16)': { piece: '', type: 'PADDING' },
      '(1, 17)': { piece: '', type: 'PADDING' },
      '(1, 18)': { piece: '', type: 'PADDING' },
      '(1, 19)': { piece: '', type: 'PADDING' },
      '(1, 20)': { piece: '', type: 'PADDING' },
      '(2, 0)': { piece: '', type: 'PADDING' },
      '(2, 1)': { piece: '', type: 'PADDING' },
      '(2, 2)': { piece: '', type: 'PADDING' },
      '(2, 3)': { piece: '', type: 'DIAMOND' },
      '(2, 4)': { piece: '', type: 'NORMAL' },
      '(2, 5)': { piece: '', type: 'DIAMOND' },
      '(2, 6)': { piece: '', type: 'NORMAL' },
      '(2, 7)': { piece: '', type: 'DIAMOND' },
      '(2, 8)': { piece: '', type: 'NORMAL' },
      '(2, 9)': { piece: '', type: 'DIAMOND' },
      '(2, 10)': { piece: '', type: 'NORMAL' },
      '(2, 11)': { piece: '', type: 'DIAMOND' },
      '(2, 12)': { piece: '', type: 'NORMAL' },
      '(2, 13)': { piece: '', type: 'DIAMOND' },
      '(2, 14)': { piece: '', type: 'NORMAL' },
      '(2, 15)': { piece: '', type: 'DIAMOND' },
      '(2, 16)': { piece: '', type: 'NORMAL' },
      '(2, 17)': { piece: '', type: 'PADDING' },
      '(2, 18)': { piece: '', type: 'PADDING' },
      '(2, 19)': { piece: '', type: 'PADDING' },
      '(2, 20)': { piece: '', type: 'PADDING' },
      '(3, 0)': { piece: '', type: 'PADDING' },
      '(3, 1)': { piece: '', type: 'PADDING' },
      '(3, 2)': { piece: '', type: 'PADDING' },
      '(3, 3)': { piece: '', type: 'NORMAL' },
      '(3, 4)': { piece: '', type: 'NORMAL' },
      '(3, 5)': { piece: '', type: 'NORMAL' },
      '(3, 6)': { piece: '', type: 'NORMAL' },
      '(3, 7)': { piece: '', type: 'NORMAL' },
      '(3, 8)': { piece: '', type: 'NORMAL' },
      '(3, 9)': { piece: '', type: 'NORMAL' },
      '(3, 10)': { piece: '', type: 'NORMAL' },
      '(3, 11)': { piece: '', type: 'NORMAL' },
      '(3, 12)': { piece: '', type: 'NORMAL' },
      '(3, 13)': { piece: '', type: 'NORMAL' },
      '(3, 14)': { piece: '', type: 'NORMAL' },
      '(3, 15)': { piece: '', type: 'NORMAL' },
      '(3, 16)': { piece: '', type: 'NORMAL' },
      '(3, 17)': { piece: '', type: 'PADDING' },
      '(3, 18)': { piece: '', type: 'PADDING' },
      '(3, 19)': { piece: '', type: 'PADDING' },
      '(3, 20)': { piece: '', type: 'PADDING' },
      '(4, 0)': { piece: '', type: 'PADDING' },
      '(4, 1)': { piece: '', type: 'PADDING' },
      '(4, 2)': { piece: '', type: 'DIAMOND' },
      '(4, 3)': { piece: '', type: 'NORMAL' },
      '(4, 4)': { piece: '', type: 'DIAMOND' },
      '(4, 5)': { piece: '', type: 'NORMAL' },
        '(4, 6)': { piece: '', type: 'DIAMOND' },
        '(4, 7)': { piece: '', type: 'NORMAL' },
        '(4, 8)': { piece: '', type: 'DIAMOND' },
        '(4, 9)': { piece: '', type: 'NORMAL' },
        '(4, 10)': { piece: '', type: 'DIAMOND' },
        '(4, 11)': { piece: '', type: 'NORMAL' },
        '(4, 12)': { piece: '', type: 'DIAMOND' },
        '(4, 13)': { piece: '', type: 'NORMAL' },
        '(4, 14)': { piece: '', type: 'DIAMOND' },
        '(4, 15)': { piece: '', type: 'NORMAL' },
        '(4, 16)': { piece: '', type: 'DIAMOND' },
        '(4, 17)': { piece: '', type: 'NORMAL' },
        '(4, 18)': { piece: '', type: 'PADDING' },
        '(4, 19)': { piece: '', type: 'PADDING' },
        '(4, 20)': { piece: '', type: 'PADDING' },
        '(5, 0)': { piece: '', type: 'PADDING' },
        '(5, 1)': { piece: '', type: 'PADDING' },
        '(5, 2)': { piece: 'rook-black', type: 'NORMAL' },
        '(5, 3)': { piece: '', type: 'NORMAL' },
        '(5, 4)': { piece: '', type: 'NORMAL' },
        '(5, 5)': { piece: '', type: 'NORMAL' },
        '(5, 6)': { piece: '', type: 'NORMAL' },
        '(5, 7)': { piece: '', type: 'NORMAL' },
        '(5, 8)': { piece: '', type: 'NORMAL' },
        '(5, 9)': { piece: '', type: 'NORMAL' },
        '(5, 10)': { piece: '', type: 'NORMAL' },
        '(5, 11)': { piece: '', type: 'NORMAL' },
        '(5, 12)': { piece: '', type: 'NORMAL' },
        '(5, 13)': { piece: '', type: 'NORMAL' },
        '(5, 14)': { piece: '', type: 'NORMAL' },
        '(5, 15)': { piece: 'rook-white', type: 'NORMAL' },
        '(5, 16)': { piece: '', type: 'NORMAL' },
        '(5, 17)': { piece: '', type: 'NORMAL' },
        '(5, 18)': { piece: '', type: 'PADDING' },
        '(5, 19)': { piece: '', type: 'PADDING' },
        '(5, 20)': { piece: '', type: 'PADDING' },
        '(6, 0)': { piece: '', type: 'PADDING' },
        '(6, 1)': { piece: '', type: 'DIAMOND' },
        '(6, 2)': { piece: '', type: 'NORMAL' },
        '(6, 3)': { piece: '', type: 'DIAMOND' },
        '(6, 4)': { piece: '', type: 'NORMAL' },
        '(6, 5)': { piece: '', type: 'DIAMOND' },
        '(6, 6)': { piece: '', type: 'NORMAL' },
        '(6, 7)': { piece: '', type: 'DIAMOND' },
        '(6, 8)': { piece: '', type: 'NORMAL' },
        '(6, 9)': { piece: '', type: 'DIAMOND' },
        '(6, 10)': { piece: '', type: 'NORMAL' },
        '(6, 11)': { piece: '', type: 'DIAMOND' },
        '(6, 12)': { piece: '', type: 'NORMAL' },
        '(6, 13)': { piece: '', type: 'DIAMOND' },
        '(6, 14)': { piece: '', type: 'NORMAL' },
        '(6, 15)': { piece: '', type: 'DIAMOND' },
        '(6, 16)': { piece: '', type: 'NORMAL' },
        '(6, 17)': { piece: '', type: 'DIAMOND' },
        '(6, 18)': { piece: '', type: 'NORMAL' },
        '(6, 19)': { piece: '', type: 'PADDING' },
        '(6, 20)': { piece: '', type: 'PADDING' },
        '(7, 0)': { piece: '', type: 'PADDING' },
        '(7, 1)': { piece: '', type: 'NORMAL' },
        '(7, 2)': { piece: '', type: 'NORMAL' },
        '(7, 3)': { piece: '', type: 'NORMAL' },
        '(7, 4)': { piece: '', type: 'NORMAL' },
        '(7, 5)': { piece: '', type: 'NORMAL' },
        '(7, 6)': { piece: '', type: 'NORMAL' },
        '(7, 7)': { piece: '', type: 'NORMAL' },
        '(7, 8)': { piece: '', type: 'NORMAL' },
        '(7, 9)': { piece: '', type: 'NORMAL' },
        '(7, 10)': { piece: '', type: 'NORMAL' },
        '(7, 11)': { piece: '', type: 'NORMAL' },
        '(7, 12)': { piece: '', type: 'NORMAL' },
        '(7, 13)': { piece: '', type: 'NORMAL' },
        '(7, 14)': { piece: '', type: 'NORMAL' },
        '(7, 15)': { piece: '', type: 'NORMAL' },
        '(7, 16)': { piece: '', type: 'NORMAL' },
        '(7, 17)': { piece: '', type: 'NORMAL' },
        '(7, 18)': { piece: '', type: 'NORMAL' },
        '(7, 19)': { piece: '', type: 'PADDING' },
        '(7, 20)': { piece: '', type: 'PADDING' },
        '(8, 0)': { piece: '', type: 'DIAMOND' },
        '(8, 1)': { piece: '', type: 'NORMAL' },
        '(8, 2)': { piece: '', type: 'DIAMOND' },
        '(8, 3)': { piece: '', type: 'NORMAL' },
        '(8, 4)': { piece: '', type: 'DIAMOND' },
        '(8, 5)': { piece: '', type: 'NORMAL' },
        '(8, 6)': { piece: '', type: 'DIAMOND' },
        '(8, 7)': { piece: '', type: 'NORMAL' },
        '(8, 8)': { piece: '', type: 'DIAMOND' },
        '(8, 9)': { piece: '', type: 'NORMAL' },
        '(8, 10)': { piece: '', type: 'DIAMOND' },
        '(8, 11)': { piece: '', type: 'NORMAL' },
        '(8, 12)': { piece: '', type: 'DIAMOND' },
        '(8, 13)': { piece: '', type: 'NORMAL' },
        '(8, 14)': { piece: '', type: 'DIAMOND' },
        '(8, 15)': { piece: '', type: 'NORMAL' },
        '(8, 16)': { piece: '', type: 'DIAMOND' },
        '(8, 17)': { piece: '', type: 'NORMAL' },
        '(8, 18)': { piece: '', type: 'DIAMOND' },
        '(8, 19)': { piece: '', type: 'NORMAL' },
        '(8, 20)': { piece: '', type: 'PADDING' },
        '(9, 0)': { piece: '', type: 'PADDING' },
        '(9, 1)': { piece: '', type: 'NORMAL' },
        '(9, 2)': { piece: '', type: 'NORMAL' },
        '(9, 3)': { piece: '', type: 'NORMAL' },
        '(9, 4)': { piece: '', type: 'NORMAL' },
        '(9, 5)': { piece: '', type: 'NORMAL' },
        '(9, 6)': { piece: '', type: 'NORMAL' },
        '(9, 7)': { piece: '', type: 'NORMAL' },
        '(9, 8)': { piece: '', type: 'NORMAL' },
        '(9, 9)': { piece: '', type: 'NORMAL' },
        '(9, 10)': { piece: '', type: 'NORMAL' },
        '(9, 11)': { piece: '', type: 'NORMAL' },
        '(9, 12)': { piece: '', type: 'NORMAL' },
        '(9, 13)': { piece: '', type: 'NORMAL' },
        '(9, 14)': { piece: '', type: 'NORMAL' },
        '(9, 15)': { piece: '', type: 'NORMAL' },
        '(9, 16)': { piece: '', type: 'NORMAL' },
        '(9, 17)': { piece: '', type: 'NORMAL' },
        '(9, 18)': { piece: '', type: 'NORMAL' },
        '(9, 19)': { piece: '', type: 'PADDING' },
        '(9, 20)': { piece: '', type: 'PADDING' },
        '(10, 0)': { piece: '', type: 'PADDING' },
        '(10, 1)': { piece: '', type: 'DIAMOND' },
        '(10, 2)': { piece: '', type: 'NORMAL' },
        '(10, 3)': { piece: '', type: 'DIAMOND' },
        '(10, 4)': { piece: '', type: 'NORMAL' },
        '(10, 5)': { piece: '', type: 'DIAMOND' },
        '(10, 6)': { piece: '', type: 'NORMAL' },
        '(10, 7)': { piece: '', type: 'DIAMOND' },
        '(10, 8)': { piece: '', type: 'NORMAL' },
        '(10, 9)': { piece: '', type: 'DIAMOND' },
        '(10, 10)': { piece: '', type: 'NORMAL' },
        '(10, 11)': { piece: '', type: 'DIAMOND' },
        '(10, 12)': { piece: '', type: 'NORMAL' },
        '(10, 13)': { piece: '', type: 'DIAMOND' },
        '(10, 14)': { piece: '', type: 'NORMAL' },
        '(10, 15)': { piece: '', type: 'DIAMOND' },
        '(10, 16)': { piece: '', type: 'NORMAL' },
        '(10, 17)': { piece: '', type: 'DIAMOND' },
        '(10, 18)': { piece: '', type: 'NORMAL' },
        '(10, 19)': { piece: '', type: 'PADDING' },
        '(10, 20)': { piece: '', type: 'PADDING' },
        '(11, 0)': { piece: '', type: 'PADDING' },
        '(11, 1)': { piece: '', type: 'PADDING' },
        '(11, 2)': { piece: '', type: 'NORMAL' },
        '(11, 3)': { piece: '', type: 'NORMAL' },
        '(11, 4)': { piece: '', type: 'NORMAL' },
        '(11, 5)': { piece: '', type: 'NORMAL' },
        '(11, 6)': { piece: '', type: 'NORMAL' },
        '(11, 7)': { piece: '', type: 'NORMAL' },
        '(11, 8)': { piece: '', type: 'NORMAL' },
        '(11, 9)': { piece: '', type: 'NORMAL' },
        '(11, 10)': { piece: '', type: 'NORMAL' },
        '(11, 11)': { piece: '', type: 'NORMAL' },
        '(11, 12)': { piece: '', type: 'NORMAL' },
        '(11, 13)': { piece: '', type: 'NORMAL' },
        '(11, 14)': { piece: '', type: 'NORMAL' },
        '(11, 15)': { piece: '', type: 'NORMAL' },
        '(11, 16)': { piece: '', type: 'NORMAL' },
        '(11, 17)': { piece: '', type: 'NORMAL' },
        '(11, 18)': { piece: '', type: 'PADDING' },
        '(11, 19)': { piece: '', type: 'PADDING' },
        '(11, 20)': { piece: '', type: 'PADDING' },
        '(12, 0)': { piece: '', type: 'PADDING' },
        '(12, 1)': { piece: '', type: 'PADDING' },
        '(12, 2)': { piece: '', type: 'DIAMOND' },
        '(12, 3)': { piece: '', type: 'NORMAL' },
        '(12, 4)': { piece: '', type: 'DIAMOND' },
        '(12, 5)': { piece: '', type: 'NORMAL' },
        '(12, 6)': { piece: '', type: 'DIAMOND' },
        '(12, 7)': { piece: '', type: 'NORMAL' },
        '(12, 8)': { piece: '', type: 'DIAMOND' },
        '(12, 9)': { piece: '', type: 'NORMAL' },
        '(12, 10)': { piece: '', type: 'DIAMOND' },
        '(12, 11)': { piece: '', type: 'NORMAL' },
        '(12, 12)': { piece: '', type: 'DIAMOND' },
        '(12, 13)': { piece: '', type: 'NORMAL' },
        '(12, 14)': { piece: '', type: 'DIAMOND' },
        '(12, 15)': { piece: '', type: 'NORMAL' },
        '(12, 16)': { piece: '', type: 'DIAMOND' },
        '(12, 17)': { piece: '', type: 'NORMAL' },
        '(12, 18)': { piece: '', type: 'PADDING' },
        '(12, 19)': { piece: '', type: 'PADDING' },
        '(12, 20)': { piece: '', type: 'PADDING' },
        '(13, 0)': { piece: '', type: 'PADDING' },
        '(13, 1)': { piece: '', type: 'PADDING' },
        '(13, 2)': { piece: '', type: 'PADDING' },
        '(13, 3)': { piece: '', type: 'NORMAL' },
        '(13, 4)': { piece: '', type: 'NORMAL' },
        '(13, 5)': { piece: '', type: 'NORMAL' },
        '(13, 6)': { piece: '', type: 'NORMAL' },
        '(13, 7)': { piece: '', type: 'NORMAL' },
        '(13, 8)': { piece: '', type: 'NORMAL' },
        '(13, 9)': { piece: '', type: 'NORMAL' },
        '(13, 10)': { piece: '', type: 'NORMAL' },
        '(13, 11)': { piece: '', type: 'NORMAL' },
        '(13, 12)': { piece: '', type: 'NORMAL' },
        '(13, 13)': { piece: '', type: 'NORMAL' },
        '(13, 14)': { piece: '', type: 'NORMAL' },
        '(13, 15)': { piece: '', type: 'NORMAL' },
        '(13, 16)': { piece: '', type: 'NORMAL' },
        '(13, 17)': { piece: '', type: 'PADDING' },
        '(13, 18)': { piece: '', type: 'PADDING' },
        '(13, 19)': { piece: '', type: 'PADDING' },
        '(13, 20)': { piece: '', type: 'PADDING' },
        '(14, 0)': { piece: '', type: 'PADDING' },
        '(14, 1)': { piece: '', type: 'PADDING' },
        '(14, 2)': { piece: '', type: 'PADDING' },
        '(14, 3)': { piece: '', type: 'DIAMOND' },
        '(14, 4)': { piece: '', type: 'NORMAL' },
        '(14, 5)': { piece: '', type: 'DIAMOND' },
        '(14, 6)': { piece: '', type: 'NORMAL' },
        '(14, 7)': { piece: '', type: 'DIAMOND' },
        '(14, 8)': { piece: '', type: 'NORMAL' },
        '(14, 9)': { piece: '', type: 'DIAMOND' },
        '(14, 10)': { piece: '', type: 'NORMAL' },
        '(14, 11)': { piece: '', type: 'DIAMOND' },
        '(14, 12)': { piece: '', type: 'NORMAL' },
        '(14, 13)': { piece: '', type: 'DIAMOND' },
        '(14, 14)': { piece: '', type: 'NORMAL' },
        '(14, 15)': { piece: '', type: 'DIAMOND' },
        '(14, 16)': { piece: '', type: 'NORMAL' },
        '(14, 17)': { piece: '', type: 'PADDING' },
        '(14, 18)': { piece: '', type: 'PADDING' },
        '(14, 19)': { piece: '', type: 'PADDING' },
        '(14, 20)': { piece: '', type: 'PADDING' },
        '(15, 0)': { piece: '', type: 'PADDING' },
        '(15, 1)': { piece: '', type: 'PADDING' },
        '(15, 2)': { piece: '', type: 'PADDING' },
        '(15, 3)': { piece: '', type: 'PADDING' },
        '(15, 4)': { piece: '', type: 'NORMAL' },
        '(15, 5)': { piece: '', type: 'NORMAL' },
        '(15, 6)': { piece: '', type: 'NORMAL' },
        '(15, 7)': { piece: '', type: 'NORMAL' },
        '(15, 8)': { piece: '', type: 'NORMAL' },
        '(15, 9)': { piece: '', type: 'NORMAL' },
        '(15, 10)': { piece: '', type: 'NORMAL' },
        '(15, 11)': { piece: '', type: 'NORMAL' },
        '(15, 12)': { piece: '', type: 'NORMAL' },
        '(15, 13)': { piece: '', type: 'NORMAL' },
        '(15, 14)': { piece: '', type: 'NORMAL' },
        '(15, 15)': { piece: '', type: 'NORMAL' },
        '(15, 16)': { piece: '', type: 'PADDING' },
        '(15, 17)': { piece: '', type: 'PADDING' },
        '(15, 18)': { piece: '', type: 'PADDING' },
        '(15, 19)': { piece: '', type: 'PADDING' },
        '(15, 20)': { piece: '', type: 'PADDING' },
        '(16, 0)': { piece: '', type: 'PADDING' },
        '(16, 1)': { piece: '', type: 'PADDING' },
        '(16, 2)': { piece: '', type: 'PADDING' },
        '(16, 3)': { piece: '', type: 'PADDING' },
        '(16, 4)': { piece: '', type: 'DIAMOND' },
        '(16, 5)': { piece: '', type: 'NORMAL' },
        '(16, 6)': { piece: '', type: 'DIAMOND' },
        '(16, 7)': { piece: '', type: 'NORMAL' },
        '(16, 8)': { piece: '', type: 'DIAMOND' },
        '(16, 9)': { piece: '', type: 'NORMAL' },
        '(16, 10)': { piece: '', type: 'DIAMOND' },
        '(16, 11)': { piece: '', type: 'NORMAL' },
        '(16, 12)': { piece: '', type: 'DIAMOND' },
        '(16, 13)': { piece: '', type: 'NORMAL' },
        '(16, 14)': { piece: '', type: 'DIAMOND' },
        '(16, 15)': { piece: '', type: 'NORMAL' },
        '(16, 16)': { piece: '', type: 'PADDING' },
        '(16, 17)': { piece: '', type: 'PADDING' },
        '(16, 18)': { piece: '', type: 'PADDING' },
        '(16, 19)': { piece: '', type: 'PADDING' },
        '(16, 20)': { piece: '', type: 'PADDING' }, 
        }, valid_moves: updatedRookValidMoves, turn: 'black'};

      mockSocket = createMockSocket();
      render(<Board initialGameData={rookOnly} gameCode='4ZP6A' disabled={false} socket={mockSocket} initialColor="white" />);

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
            new_pos: '5,15'
          })
        });
      });

      mockSocket.emitEvent('game_data', updatedGameData);

      await waitFor(() => { 
        const whiteRookNew = screen.queryByTestId('rook-white-5-15');
        expect(whiteRookNew).toBeInTheDocument();
      });
  });

  it('cancel rook move', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode='4ZP6A' disabled={false} socket={mockSocket} initialColor="white" />);
      
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
      const whiteRook = screen.queryByTestId('rook-white-5-17');
      expect(whiteRook).toBeInTheDocument();
    });
  });

  it('ensure when its blacks turn a white piece cannot be clicked', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode='4ZP6A' disabled={false} socket={mockSocket} initialColor="black" />);
      
    const whiteRook = screen.queryByTestId('rook-white-5-17');
    fireEvent.click(whiteRook);
    
    checkNotHighlightedTiles(rookValidMoves['5,17']);
  });

  it('ensure when its whites turn a black piece cannot be clicked', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={rookOnly} gameCode='4ZP6A' disabled={false} socket={mockSocket} initialColor="white" />);
      
    const whiteRook = screen.queryByTestId('rook-black-5-2');
    fireEvent.click(whiteRook);
    
    checkNotHighlightedTiles(rookValidMoves['5,2']);
  });

  it('check that if player selected white board renders with white on lower half', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={initialGameData} gameCode='4ZP6A' disabled={false} socket={mockSocket} initialColor="white" />);
      
    const whiteJester = screen.queryByTestId('jester-white-8-19');
    expect(whiteJester).toBeInTheDocument();
    const boardElement = screen.queryByTestId('board');
    expect(boardElement).not.toHaveClass('rotate-180');
  });

  it('check that if player selected black board renders with black on lower half', async () => {
    mockSocket = createMockSocket();
    render(<Board initialGameData={initialGameData} gameCode='4ZP6A' disabled={false} socket={mockSocket} initialColor="black" />);
      
    const whiteJester = screen.queryByTestId('jester-white-8-19');
    expect(whiteJester).toBeInTheDocument();
    const boardElement = screen.queryByTestId('board');
    expect(boardElement).toHaveClass('rotate-180');
  });

});