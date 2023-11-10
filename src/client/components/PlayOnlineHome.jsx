"use client"

import React, { useState } from 'react';
import { CreateLobbyButton, JoinExistingLobbyButton } from './Buttons';
import CreateLobby from './CreateLobby';
import JoinExistingLobby from './JoinExistingLobby';

export default function PlayOnlineSetUp() {
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
      {(!createLobby && !joinLobby) && (
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <CreateLobbyButton onClick={handleCreateLobbyClick} />
          <JoinExistingLobbyButton onClick={handleJoinExistingLobby} />
        </div>
      </div>
      )}
      {createLobby && <CreateLobby />}
      {joinLobby && <JoinExistingLobby />}
    </section>
  );
}
