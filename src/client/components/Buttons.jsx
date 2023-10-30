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
    <button className="text-5xl rounded-lg font-semibold bg-blue-400 text-white px-8 py-6 hover:bg-blue-500 focus:bg-blue-600" type="button" onClick={() => {}}>
      Play Online
    </button>
  );
}

export function PlayLocalButton() {
  return (
    <button className="text-5xl rounded-lg font-semibold bg-blue-400 text-white px-8 py-6 hover:bg-blue-500 focus:bg-blue-600" type="button" onClick={() => {}}>
      Play Local
    </button>
  );
}
