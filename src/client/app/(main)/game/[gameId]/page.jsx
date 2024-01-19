import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import baseUrl from '../../../../constants';
import Game from '../../../../components/Game';
import PageNotFound from '../../../../components/PageNotFound';
import { authOptions } from '../../../api/auth/[...nextauth]/route';

export default async function page({ params }) {
  const session = await getServerSession(authOptions);
  const { gameId } = params;

  if (!session) {
    redirect('/api/auth/signin'); // TODO: Callback should be current game link
  }

  const url = `${baseUrl}/api/game/${gameId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const gameData = await response.json();

  return (
    <main className="relative flex justify-center items-center h-screen gap-3">
      {gameData?.board
        ? <Game gameData={gameData} />
        : <PageNotFound title="Sorry, this game does not exist." message="Make sure the game URL has been entered correctly. Otherwise, this game either does not exist or has ended. Return to the homepage to start or join a different game!" />}
    </main>
  );
}
