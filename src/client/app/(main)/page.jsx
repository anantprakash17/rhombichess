import React from 'react';
import LandingHero from '../../components/LandingHero';
import Board from '../../components/Board';

export default async function Home() {
  return (
    <main className="relative flex justify-center items-center min-h-screen">
      <Board />
    </main>
  );
}
