import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PlayOnlineHome from '../../../../components/PlayOnlineHome';
import { authOptions } from '../../../api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin'); // TODO: Callback should be /play/online
  }

  return (
    <main className="relative flex justify-center items-center min-h-screen">
      <PlayOnlineHome />
    </main>
  );
}
