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
  const data = await response.json();

  return (
    <main className="z-10 absolute top-0 sm:relative flex-col sm:flex-row flex justify-center items-center h-screen">
      <div className="w-full sm:w-1/2 sm:-mr-16">
        <LandingHero />
      </div>
      <div className="hidden sm:flex w-1/2 scale-[.85] justify-center items-center content-center">
        <Board initialGameData={data} disabled labels={false} />
      </div>
    </main>
  );
}
