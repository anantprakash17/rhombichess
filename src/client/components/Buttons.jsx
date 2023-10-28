'use client';

import React from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button type="button" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
