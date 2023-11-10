import React, { useState } from 'react';
import { CreateLobbyButton } from './Buttons';
import { ClosedEye, OpenEye } from './icons/EyeIcons';

export default function CreateLobby() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="bg-whitebg-gray-900 mb-12"> 
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12 space-y-8">
        <h1 className="text-center mb-8 text-6xl font-bold tracking-tight leading-none text-gray-900">
          Create a New Lobby
        </h1>
        <form className="space-y-8"> 
          <div>
            <label htmlFor="password" className="block mb-2 text-lg font-normal text-gray-500 lg:text-xl text-left">
              New Lobby Password (optional)
            </label>
            <div className="relative">
              <input
                className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
          </div>
          <div className="text-center">
            <CreateLobbyButton />
          </div>
        </form>
      </div>
    </section>
  );
}