import React from 'react';
import Link from 'next/link';
import { PlayLocalButton, PlayOnlineButton } from './Buttons';

export default function LandingHero() {
  return (
    <section className="bg-white mb-12">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center">
        <Link href="/rules">
          <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
            <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
            <span className="text-sm font-medium">
              Check out the rules for this variant!
            </span>
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          </div>
        </Link>
        <h1 className="mb-8 sm:mb-4 text-3xl sm:text-5xl font-bold tracking-tight sm:leading-none text-gray-900">
          All-New Strategic Online
          <br />
          Chess Variant!
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16">
          Experience the thrill of RhombiChess, where traditional strategy meets innovative gameplay!
          A fresh twist on classic chess, featuring a challenging rhombus-shaped board and exciting new pieces!
        </p>
        <div className="flex flex-col">
          <div className="flex sm:mb-8 lg:mb-16 flex-row justify-center space-y-0 space-x-4 pointer-events-none sm:pointer-events-auto">
            <PlayOnlineButton />
            <PlayLocalButton />
          </div>
          <p className="sm:hidden font-semibold bg-red-200 text-red-800 rounded-lg p-3 m-4">
            Gameplay is not yet available on mobile or tablet devices. We apologize for the inconvenience.
          </p>
        </div>
      </div>
    </section>
  );
}
