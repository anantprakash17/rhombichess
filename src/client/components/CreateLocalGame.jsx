/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import baseUrl from '../constants';

export default function CreateLocalGame() {
  const session = useSession();

  const handleCreateGame = async (event) => {
    event.preventDefault();

    if (!session.data?.user) { return; }

    const formData = new FormData(event.target);

    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    const minutes = formDataObject.minutes || '0';
    const seconds = formDataObject.seconds || '0';

    const timerDuration = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);

    const url = `${baseUrl}/api/new_game`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        local: true,
        user: session.data.user,
        color: 'white',
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
        Create a New Local Game
      </h1>
      <form className="space-y-6 mb-10" onSubmit={handleCreateGame}>
        <p className="text-xl pt-3 pb-4 font-medium text-gray-600">
          Local games are meant to be played between two players on the same device.
          We leave it to you to choose your colors - remember that white always plays first.
          Have fun!
        </p>
        <div>
          <label htmlFor="timer" className="mb-2 block font-medium">
            Timer Duration (optional)
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
