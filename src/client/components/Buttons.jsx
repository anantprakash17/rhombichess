'use client';

import React from 'react';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button className="px-6 py-2 bg-blue-300 font-semibold text-slate-800 rounded-lg" type="button" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}

export function PlayOnlineButton() {
  return (
    <a href="/play/online">
      <button className="text-3xl rounded-lg font-semibold bg-green-500 text-white px-6 py-4 hover:bg-green-600 focus:bg-green-700" type="button">
        Play Online
      </button>
    </a>
  );
}

export function PlayLocalButton() {
  return (
    <button className="text-2xl rounded-lg font-semibold bg-blue-400 text-white px-4 py-2 hover:bg-blue-500 focus:bg-blue-600" type="button" onClick={() => {}}>
      Play Local
    </button>
  );
}

export function CreateLobbyButton() {
  return (
    <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="button" onClick={() => {}}>
      Start New Game
    </button>
  );
}

export function JoinExistingLobbyButton({ lobbyCode }) {
  return (
    <a href={`/game/${lobbyCode}`}>
      <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="button" onClick={() => {}}>
        Join Game
      </button>
    </a>
  );
}

export function SendMessageButton({ onClick }) {
  return (
    <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="button" onClick={onClick}>
      Send Message
    </button>
  );
}

