import '../globals.css';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rules',
  description: 'The official rules for the Rhombichess variant',
}

export default function RootLayout({ children }) {
 return (
  <html lang="en">
    <body className={inter.className}>
      {children}
    </body>
  </html>
);
}
