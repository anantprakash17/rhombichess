import React from 'react';

import { JoinExistingLobbyButton } from './Buttons';

export default function JoinExistingLobby() {
  return (
    <section className="bg-whitebg-gray-900 mb-12">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h1 className="mb-8 text-6xl font-bold tracking-tight leading-none text-gray-900 text-center">
          Join an Existing Lobby
        </h1>
        <form className="space-y-10"> 
          <div>
            <label htmlFor="lobbyCode" className="block mb-2 text-lg font-normal text-gray-500 lg:text-xl text-left">
              Existing Lobby Code
            </label>
            <div className="relative">
              <input
                className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                id="lobbyCode"
                name="lobby code"
                type="text"
              />
            </div>
          </div>
          <div className="text-center">
            <JoinExistingLobbyButton />
          </div>
        </form>
      </div>
    </section>
  );
}