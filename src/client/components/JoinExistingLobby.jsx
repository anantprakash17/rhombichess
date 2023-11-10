import React from 'react';

export default function JoinExistingLobby() {
  return (
    <section className="bg-whitebg-gray-900 mb-12">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            Enter lobby code
          </label>
          <input
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            id="password"
            name="password"
            placeholder=""
            required
            type="password" 
          />
        </div>
      </div>
    </section>
  );
}