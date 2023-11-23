import React from 'react';
import LandingHero from '../../components/LandingHero';
import Board from '../../components/Board';

// Temporary JSON Response Example
const board = [['soldier-black', '', '', '', '', 'soldier-white'], ['elephant-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'elephant-white'], ['bishop-black', 'pawn-black', '', '', '', 'pawn-white', 'bishop-white'], ['elephant-black', 'shield-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'shield-white', 'elephant-white'], ['prince-black', 'soldier-black', '', '', '', '', 'soldier-white', 'prince-white'], ['rook-black', 'dog-black', 'cat-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'cat-white', 'dog-white', 'rook-white'], ['mammoth-black', 'shield-black', 'pawn-black', '', '', '', 'pawn-white', 'shield-white', 'mammoth-white'], ['queen-black', 'jester-black', 'machine-black', 'knight-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'knight-white', 'machine-white', 'jester-white', 'queen-white'], ['jester-black', 'cat-black', 'soldier-black', '', '', '', '', 'soldier-white', 'cat-white', 'jester-white'], ['king-black', 'jester-black', 'machine-black', 'knight-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'knight-white', 'machine-white', 'jester-white', 'king-white'], ['hawk-black', 'dog-black', 'pawn-black', '', '', '', 'pawn-white', 'dog-white', 'hawk-white'], ['rook-black', 'shield-black', 'cat-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'cat-white', 'shield-white', 'rook-white'], ['prince-black', 'soldier-black', '', '', '', '', 'soldier-white', 'prince-white'], ['bishop-black', 'dog-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'dog-white', 'bishop-white'], ['elephant-black', 'pawn-black', '', '', '', 'pawn-white', 'elephant-white'], ['bishop-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'bishop-white'], ['soldier-black', '', '', '', '', 'soldier-white']];

export default async function Home() {
  return (
    <main className="relative flex justify-center items-center h-screen">
      <div className="w-1/2 -mr-16">
        <LandingHero />
      </div>
      <div className="w-1/2 scale-[.85] flex justify-center items-center content-center">
        <Board initialBoard={board} disabled />
      </div>
    </main>
  );
}
