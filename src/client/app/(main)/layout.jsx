import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import AuthProvider from '../AuthProvider';
import SideBar from '../../components/SideBar';
import ToastProvider from '../ToastProvider';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RhombiChess',
  description: 'An exciting new chess variant.',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <AuthProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider>
            <SideBar session={session} />
            <div className="sm:ml-64 flex-grow">
              {children}
            </div>
          </ToastProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
