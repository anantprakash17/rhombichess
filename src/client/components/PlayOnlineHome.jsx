'use client';

import React from 'react';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';

export default function PlayOnlineHome() {
  return (
    <section className="bg-whitebg-gray-900 w-full rounded-lg p-6 max-w-[500px]">
      <CreateGame />
      <div className="flex items-center justify-center space-x-2 py-4 mb-6">
        <div className="flex-1 border-t border-gray-400" />
        <span className="px-2 text-sm text-gray-600">OR</span>
        <div className="flex-1 border-t border-gray-400" />
      </div>
      <JoinGame />
    </section>
  );
}
