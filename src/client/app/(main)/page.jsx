import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { PlayLocalButton, PlayOnlineButton } from '../../components/Buttons';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex justify-center items-center min-h-screen gap-3">
      <PlayOnlineButton />
      <PlayLocalButton />
    </main>
  );
}
