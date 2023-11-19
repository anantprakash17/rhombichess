import React from 'react';
import prisma from '../../../../lib/prisma';
import PageNotFound from '../../../../components/PageNotFound';
import Game from '../../../../components/Game';

export default async function page({ params }) {
  const { gameId } = params;

  // TODO: Once API has been set up, retrieve game information from API

  const gameExists = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });

  return (
    <main className="relative flex justify-center items-center min-h-screen gap-3">
      <span className=" font-semibold">
        {gameExists ? <Game lobbyCode={gameId} /> : <PageNotFound title="Sorry, this game does not exist." message="Make sure the game URL has been entered correctly. Otherwise, this game either does not exist or has ended. Return to the homepage to start or join a different game!" />}
      </span>
    </main>
  );
}
