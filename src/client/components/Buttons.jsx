

import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useNavigate } from 'react-router-dom';


export function SignOutButton() {
  return (
    <button className="px-6 py-2 bg-blue-300 font-semibold text-slate-800 rounded-lg" type="button" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}

export function PlayOnlineButton() {
  //const navigate = useNavigate();
  const router = useRouter();
  return (
    <button className="text-3xl rounded-lg font-semibold bg-green-500 text-white px-6 py-4 hover:bg-green-600 focus:bg-green-700" type="button" onClick={() => router.push('/play/online')}>
      Play Online
    </button>
  );
}

export function CreateLobbyButton() {
  return (
    <button className="text-3xl rounded-lg font-semibold bg-green-500 text-white px-6 py-4 hover:bg-green-600 focus:bg-green-700" type="button" onClick={() => {}}>
      Create
    </button>
  );
}

export function JoinExistingLobbyButton() {
  return (
    <button className="text-3xl rounded-lg font-semibold bg-green-500 text-white px-6 py-4 hover:bg-green-600 focus:bg-green-700" type="button" onClick={() => {}}>
      Join
    </button>
  );
}

export function CreateLobbyPageButton({ onClick }) {
  return (
    <button className="text-3xl rounded-lg font-semibold bg-blue-400 text-white px-6 py-4 hover:bg-blue-500 focus:bg-blue-600" type="button" onClick={onClick}>
      Create Lobby
    </button>
  );
}

export function JoinExistingLobbyPageButton({ onClick }) {
  return (
    <button className="text-3xl rounded-lg font-semibold bg-blue-400 text-white px-6 py-4 hover:bg-blue-500 focus:bg-blue-600" type="button" onClick={onClick}>
      Join Existing Lobby
    </button>
  );
}

export function PlayLocalButton() {
  return (
    <button className="text-3xl rounded-lg font-semibold bg-blue-400 text-white px-6 py-4 hover:bg-blue-500 focus:bg-blue-600" type="button" onClick={() => {}}>
      Play Local
    </button>
  );
}

