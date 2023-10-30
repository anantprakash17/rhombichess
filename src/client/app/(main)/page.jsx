import React from 'react';
import { PlayLocalButton, PlayOnlineButton } from '../../components/Buttons';

export default async function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen gap-3">
      <PlayOnlineButton />
      <PlayLocalButton />
    </main>
  );
}
