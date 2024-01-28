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
      <button className="text-2xl rounded-lg font-semibold bg-green-500 text-white px-4 py-2 hover:bg-green-600 focus:bg-green-700" type="button">
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

export function SendMessageButton({ onClick }) {
  return (
    <button className="flex items-center bg-blue-500 mb- p-[0.7rem] rounded-md" type="button" aria-label="Send Message" onClick={onClick}>
      <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 18-7 3 7-18 7 18-7-3Zm0 0v-5" />
      </svg>
    </button>
  );
}
