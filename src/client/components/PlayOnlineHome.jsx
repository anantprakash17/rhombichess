'use client';

import React, { useState } from 'react';
import { ClosedEye, OpenEye } from './icons/EyeIcons';

export default function PlayOnlineHome() {
  const [showPassword, setShowPassword] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');

  const handleLobbyCodeChange = (event) => setLobbyCode(event.target.value.trim());

  const handleCreateGame = (event) => {
    event.preventDefault();
    // TODO: Create new game
  };

  const handleJoinGame = (event) => {
    event.preventDefault();
    if (lobbyCode) {
      window.location.href = `/game/${lobbyCode}`;
    }
  };

  return (
    <section className="bg-whitebg-gray-900 w-full rounded-lg p-6 max-w-[500px]">
      <h1 className="mb-6 text-3xl text-center font-bold tracking-tight leading-none text-gray-900">
        Start a New Game
      </h1>
      <form className="space-y-6 mb-10" onSubmit={handleCreateGame}>
        <div>
          <label htmlFor="password" className="mb-2 block font-medium">
            Password (optional)
          </label>
          <div className="relative">
            <input
              className="mb-4 block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              id="password"
              name="password"
              placeholder={showPassword ? 'password' : '••••••••'}
              type={showPassword ? 'text' : 'password'}
            />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 my-auto ml-2 mr-2.5 flex h-fit items-center p-1"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? (
                <OpenEye />
              ) : (
                <ClosedEye />
              )}
            </button>
          </div>
          <div className="text-center">
            <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="button" onClick={() => {}}>
              Start New Game
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center space-x-2 py-4 mb-6">
        <div className="flex-1 border-t border-gray-400" />
        <span className="px-2 text-sm text-gray-600">OR</span>
        <div className="flex-1 border-t border-gray-400" />
      </div>
      <h1 className="mb-6 text-3xl text-center font-bold tracking-tight leading-none text-gray-900">
        Join an Existing Game
      </h1>
      <form className="space-y-6" onSubmit={handleJoinGame}>
        <div>
          <label htmlFor="lobbyCode" className="mb-2 block font-medium">
            Game Code
          </label>
          <div className="relative">
            <input
              className="mb-4 block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              id="lobbyCode"
              name="lobbyCode"
              onChange={handleLobbyCodeChange}
              placeholder="4ZP6A"
              required
              type="text"
            />
          </div>
          <div className="text-center">
            <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="button" onClick={() => {}}>
              Join Game
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
