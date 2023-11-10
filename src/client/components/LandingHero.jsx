'use client'

import React from 'react';
import { PlayLocalButton, PlayOnlineButton } from './Buttons';
import Link from 'next/link';

export default function LandingHero() {
  return (
    <section className="bg-whitebg-gray-900 mb-12">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
      <Link href="/rules">
        <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full bg-gray-800text-white hover:bg-gray-200hover:bg-gray-700">
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
          <span className="text-sm font-medium">
            Check out the rules for this variant!
          </span>
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </div>
        </Link>
        <h1 className="mb-4 text-6xl font-bold tracking-tight leading-none text-gray-900">
          All-New Strategic Online Chess Variant!
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Voluptate necessitatibus optio libero, tempore,
          labore fugit adipisci nobis soluta iusto animi nihil voluptatum?
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <PlayOnlineButton />
          <PlayLocalButton />
        </div>
      </div>
    </section>
  );
}
