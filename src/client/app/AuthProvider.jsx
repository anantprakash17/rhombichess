/* eslint-disable react/forbid-prop-types */

'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import PropTypes from 'prop-types';

export default function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  session: PropTypes.object.isRequired,
};
