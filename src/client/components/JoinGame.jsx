'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ClosedEye, OpenEye } from './icons/EyeIcons';
import baseUrl from '../constants';

export default function JoinGame() {
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [password, setPassword] = useState('');
  const [showGamePasswordField, setShowGamePasswordField] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGameCodeChange = (event) => {
    setGameCode(event.target.value.trim());
    setShowGamePasswordField(false);
    setErrorMessage('');
  };

  const handleJoiningPasswordChange = (event) => setPassword(event.target.value.trim());

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

      if (data?.error_message) {
        setErrorMessage(data?.error_message);
      } else if (!gamePassword || gamePassword === password) {
        const joinGameUrl = `${baseUrl}/api/join_game/${gameCode}`;
        const joinGameResponse = await fetch(joinGameUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: session.data.user,
            password: gamePassword,
          }),
        });
        const joinData = await joinGameResponse.json();

        if (joinData?.error_message) {
          setErrorMessage(joinData.error_message);
        } else {
          window.location.href = `/game/${gameCode}`;
        }
      } else {
        if (!password) {
          setErrorMessage('This game requires a password.');
        } else if (gamePassword !== password) {
          setErrorMessage('Incorrect code or password. Please try again.');
        }
        setShowGamePasswordField(true);
      }
    }
  };

  return (
    <div>
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
          <div className="flex gap-4">
            <div className="flex-grow">
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
            </div>
            {showGamePasswordField && (
            <div className="flex-grow">
              <label htmlFor="gameCode" className="mb-2 block font-medium">
                Game Password
              </label>
              <div className="relative">
                <input
                  className="mb-4 block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  id="password"
                  name="password"
                  onChange={handleJoiningPasswordChange}
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
            </div>
            )}
          </div>
          <div className="text-center">
            <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="submit" onClick={() => {}}>
              Join Game
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
