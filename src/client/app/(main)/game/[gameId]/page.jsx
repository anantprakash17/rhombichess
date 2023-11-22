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
  const url = `${baseUrl}/api/game/${gameId}`;

  if (!session) {
    redirect('/api/auth/signin'); // TODO: Callback should be current game link
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  const initialBoard = data?.board;

  return (
    <main className="relative flex justify-center items-center min-h-screen gap-3">
      <span className=" font-semibold">
        {initialBoard
          ? <Game gameCode={gameId} initialBoard={initialBoard} />
          : <PageNotFound title="Sorry, this game does not exist." message="Make sure the game URL has been entered correctly. Otherwise, this game either does not exist or has ended. Return to the homepage to start or join a different game!" />}
      </span>
    </main>
  );
}
