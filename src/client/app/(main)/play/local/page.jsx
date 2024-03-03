import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PlayLocalHome from '../../../../components/PlayLocalHome';
import { authOptions } from '../../../api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin'); // TODO: Callback should be /play/online
  }

  return (
    <main className="relative flex justify-center items-center min-h-screen">
      <PlayLocalHome />
    </main>
  );
}
