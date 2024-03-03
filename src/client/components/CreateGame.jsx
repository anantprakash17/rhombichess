/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ClosedEye, OpenEye } from './icons/EyeIcons';
import baseUrl from '../constants';

export default function CreateGame() {
  const [showPassword, setShowPassword] = useState(false);
  const session = useSession();

  const handleCreateGame = async (event) => {
    event.preventDefault();

    if (!session.data?.user) { return; }

    const formData = new FormData(event.target);

    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    let { color } = formDataObject;
    if (color === 'random' || !color) {
      color = Math.random() < 0.5 ? 'white' : 'black';
    }

    const minutes = formDataObject.minutes || '0';
    const seconds = formDataObject.seconds || '0';

    const timerDuration = `${minutes}:${seconds}`;


    const url = `${baseUrl}/api/new_game`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: session.data.user,
        password: formDataObject.password,
        color,
        timer_duration: timerDuration,
      }),
    });

    const data = await response.json();
    const newGameCode = data.game_id;

    if (newGameCode) {
      window.location.href = `/game/${newGameCode}`;
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl text-center font-bold tracking-tight leading-none text-gray-900">
        Create a New Game
      </h1>
      <form className="space-y-6 mb-10" onSubmit={handleCreateGame}>
        <div>
          <p className="mb-2 block font-medium">
            Your Color
          </p>
          <ul className="flex gap-2">
            <li>
              <input type="radio" id="random" name="color" value="random" className="hidden peer" required defaultChecked />
              <label htmlFor="random" className="inline-flex items-center justify-between py-2 px-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white hover:text-gray-500 hover:bg-gray-100">
                <div className="block">
                  <div className="w-full font-semibold">Random</div>
                </div>
              </label>
            </li>
            <li>
              <input type="radio" id="black" name="color" value="black" className="hidden peer" required />
              <label htmlFor="black" className="inline-flex items-center justify-between py-2 px-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white hover:text-gray-500 hover:bg-gray-100">
                <div className="block">
                  <div className="w-full font-semibold">Black</div>
                </div>
              </label>
            </li>
            <li>
              <input type="radio" id="white" name="color" value="white" className="hidden peer" required />
              <label htmlFor="white" className="inline-flex items-center justify-between py-2 px-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white hover:text-gray-500 hover:bg-gray-100">
                <div className="block">
                  <div className="w-full font-semibold">White</div>
                </div>
              </label>
            </li>
          </ul>
        </div>
        <div>
          <label htmlFor="timer" className="mb-2 block font-medium">
            Timer Duration
          </label>
          <div className="flex gap-2">
            <input
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              id="minutes"
              name="minutes"
              placeholder="Minutes"
              min="0"
            />
            <input
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              id="seconds"
              name="seconds"
              placeholder="Seconds"
              min="0"
              max="59"
            />
          </div>
        </div>
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
            <button className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed" type="submit" onClick={() => {}}>
              Create Game
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
