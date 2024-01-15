'use client';

import React, { useState } from 'react';
import { ClosedEye, OpenEye } from './icons/EyeIcons';
import baseUrl from '../constants';

export default function PlayOnlineHome() {
  const [showPassword, setShowPassword] = useState(false);
  const [showExistingPassword, setShowExistingPassword] = useState(false);
  const [gameCode, setgameCode] = useState('');
  const [password, setPassword] = useState('');
  const [existingGamePassword, setExistingGamePassword] = useState('');
  const [showGamePasswordField, setShowGamePasswordField] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGameCodeChange = (event) => setgameCode(event.target.value.trim());

  const handlePasswordChange = (event) => setPassword(event.target.value.trim());

  const handleExistingGamePasswordChange = (event) => setExistingGamePassword(event.target.value.trim());

  const handleCreateGame = async (event) => {
    event.preventDefault();

    const url = `${baseUrl}/api/new_game`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password }),
    });

    const data = await response.json();
    const newGameCode = data.game_id;

    if (newGameCode) {
      window.location.href = `/game/${newGameCode}`;
    }
  };

  const handleJoinGame = async (event) => {
    event.preventDefault();

    if (gameCode) {
      const url = `${baseUrl}/api/game/${gameCode}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const gamePassword = data?.password;

      if (gamePassword === '') {
        window.location.href = `/game/${gameCode}`;
      }
      else {
        if (existingGamePassword === '') {
          setErrorMessage('This game requires a password.');
        } else if (gamePassword === existingGamePassword) {
          window.location.href = `/game/${gameCode}`;
        } else if (gamePassword !== existingGamePassword) {
          setErrorMessage('Incorrect game code or game password. Please try again.');
        }
        setShowGamePasswordField(true);
      }
    }
  };

  return (
    <section className="bg-whitebg-gray-900 w-full rounded-lg p-6 max-w-[500px]">
      <h1 className="mb-6 text-3xl text-center font-bold tracking-tight leading-none text-gray-900">
        Create a New Game
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
              onChange = {handlePasswordChange}
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
            <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="submit" onClick={() => {}}>
              Create Game
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
      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
      <form className="space-y-6" onSubmit={handleJoinGame}>
        <div>
          <label htmlFor="gameCode" className="mb-2 block font-medium">
            Game Code
          </label>
          <div className="relative">
            <input
              className="mb-4 block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              id="gameCode"
              name="gameCode"
              onChange={handleGameCodeChange}
              placeholder="4ZP6A"
              required
              type="text"
            />
          </div>
          {showGamePasswordField && (
            <>
              <label htmlFor="gameCode" className="mb-2 block font-medium">
                Game Password
              </label>
              <div className="relative">
                <input
                  className="mb-4 block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  id="password"
                  name="password"
                  onChange = {handleExistingGamePasswordChange}
                  placeholder={showExistingPassword ? 'password' : '••••••••'}
                  type={showExistingPassword ? 'text' : 'password'}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 my-auto ml-2 mr-2.5 flex h-fit items-center p-1"
                  onClick={() => setShowExistingPassword(!showExistingPassword)}
                  type="button"
                >
                  {showExistingPassword ? (
                    <OpenEye />
                  ) : (
                    <ClosedEye />
                  )}
                </button>
              </div>
            </>
          )}
          <div className="text-center">
            <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="submit" onClick={() => {}}>
              Join Game
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
