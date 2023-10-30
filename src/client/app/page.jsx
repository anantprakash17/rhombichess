import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from './api/auth/[...nextauth]/route';
import SideBar from '../components/SideBar';
import { PlayLocalButton, PlayOnlineButton } from '../components/Buttons';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen w-full">
      <SideBar session={session} />
      <div className="sm:ml-64 p-5 flex justify-center items-center flex-grow gap-4">
        <PlayOnlineButton />
        <PlayLocalButton />
      </div>
    </main>
  );
}
