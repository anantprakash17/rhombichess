import { getServerSession } from 'next-auth';
import React from 'react';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';
import SignOutButton from '../components/Buttons';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignOutButton />
      RhombiChess
    </main>
  );
}
