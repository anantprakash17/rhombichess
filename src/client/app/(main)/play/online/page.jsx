import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PlayOnlineHome from '../../../../components/PlayOnlineHome';
import { authOptions } from '../../../api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const response = await fetch(`http://localhost:8080/api/new_game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  const lobbyCode = data['game_id'];



  if (!session) {
    redirect('/api/auth/signin'); // TODO: Callback should be /play/online
  }

  return (
    <main className="relative flex justify-center items-center min-h-screen">
      <PlayOnlineHome newLobbyCode={lobbyCode}/>
    </main>
  );
}
