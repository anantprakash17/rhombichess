import '../globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import AuthProvider from '../AuthProvider';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import SideBar from '../../components/SideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rules',
  description: 'The official rules for the Rhombichess variant',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <AuthProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <SideBar session={session} />
          <div className="sm:ml-64 flex-grow">
            {children}
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
