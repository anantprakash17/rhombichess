'use client'

import React, { useState } from 'react';
import { CreateLobbyPageButton, JoinExistingLobbyPageButton } from './Buttons';
import CreateLobby from './CreateLobby';
import JoinExistingLobby from './JoinExistingLobby';

export default function PlayOnlineHome() {
  const [createLobby, setCreateLobby] = useState(false);
  const [joinLobby, setJoinLobby] = useState(false);

  const handleCreateLobbyClick = () => {
    setCreateLobby(true);
  };

  const handleJoinExistingLobby = () => {
    setJoinLobby(true);
  }

  return (
    <section className="bg-whitebg-gray-900 mb-12">
      {!createLobby && !joinLobby && (
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-6xl font-bold tracking-tight leading-none text-gray-900">
            Choose Your Online Play
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48text-gray-400">
            Select an option to get started with online play.
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <CreateLobbyPageButton onClick={handleCreateLobbyClick} />
            <JoinExistingLobbyPageButton onClick={handleJoinExistingLobby} />
          </div>
        </div>
      )}
      {createLobby && <CreateLobby />}
      {joinLobby && <JoinExistingLobby />}
    </section>
  );
}