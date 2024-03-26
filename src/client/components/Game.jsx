/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import Board from './Board';
import ChatWindow from './ChatWindow';
import GameStatsTab from './GameStatsTab';
import baseUrl from '../constants';

export default function Game({ gameData }) {
  const [socket, setSocket] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [gameCode, setGameCode] = useState(gameData?.game_id);
  const session = useSession();
  const [activeTab, setActiveTab] = useState('game');

  const tabs = {
    game: { label: 'GAME', content: <GameStatsTab gameData={gameData} socket={socket} /> },
    newGame: { label: 'NEW GAME', content: 'NEW GAME CONTENT' },
    games: { label: 'GAMES', content: 'GAMES CONTENT' },
    players: { label: 'PLAYERS', content: 'PLAYERS CONTENT' },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newSocket = io.connect(`${baseUrl}`);
      setSocket(newSocket);
      return () => newSocket.disconnect();
    } return null;
  }, []);

  useEffect(() => {
    if (socket && session && gameCode !== '') {
      socket.emit('join_room', { room: gameCode, user: JSON.stringify(session.data?.user) });
    }
  }, [socket, gameCode]);

  let color = gameData.player_1.id === session.data?.user.id
    ? gameData.player_1.color
    : gameData.player_2.color;

  if (gameData.local) {
    color = gameData.turn;
  }

  return (
    <section className="w-full flex h-screen">
      <button type="button" onClick={() => { setShowLabels(!showLabels); }} className="absolute left-0 bottom-0 p-1 m-2 bg-gray-200 rounded hover:bg-gray-300">
        <svg className="w-7 h-7 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4" />
        </svg>
      </button>
      <div className="flex flex-1 justify-center items-center m-5">
        <div className="scale-90 flex-grow">
          <Board initialGameData={gameData} initialColor={color} gameCode={gameCode} socket={socket} labels={showLabels} />
        </div>
        <div className="h-full shadow-lg w-[450px] relative rounded-xl bg-gray-500 flex flex-col text-base text-gray-900">
          <div className="bg-gray-400 rounded-xl flex text-white font-semibold">
            <button type="button" onClick={() => setActiveTab('game')} className={`${activeTab === 'game' ? 'bg-gray-700' : 'bg-gray-600'} rounded-tl-xl flex-1 p-4`}>GAME</button>
            <button type="button" onClick={() => setActiveTab('games')} className={`${activeTab === 'games' ? 'bg-gray-700' : 'bg-gray-600'} flex-1 p-4`}>GAMES</button>
            <button type="button" onClick={() => setActiveTab('players')} className={`${activeTab === 'players' ? 'bg-gray-700' : 'bg-gray-600'} rounded-tr-xl flex-1 p-4`}>PLAYERS</button>
          </div>
          <div className="m-2 flex-grow">
            {tabs[activeTab].content}
          </div>
          <div className="flex-grow scrollbar-custom overflow-y-auto rounded-b-xl max-h-[375px]">
            <ChatWindow gameCode={gameCode} socket={socket} />
          </div>
        </div>
      </div>
    </section>
  );
}
