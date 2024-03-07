import React from 'react';
import LandingHero from '../../components/LandingHero';
import Board from '../../components/Board';
import baseUrl from '../../constants';

export default async function Home() {
  const url = `${baseUrl}/api/initial_board`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { board } = await response.json();

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
