/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import Board from './Board';
import ChatWindow from './ChatWindow';
import GameStatsTab from './GameStatsTab';

export default function Game({ gameData }) {
  const [socket, setSocket] = useState(null);
  const [gameCode, setGameCode] = useState(gameData?.game_id);
  const session = useSession();
  const [activeTab, setActiveTab] = useState('game');

  const tabs = {
    game: { label: 'GAME', content: <GameStatsTab gameCode={gameCode} gamePassword={gameData?.password} /> },
    newGame: { label: 'NEW GAME', content: 'NEW GAME CONTENT' },
    games: { label: 'GAMES', content: 'GAMES CONTENT' },
    players: { label: 'PLAYERS', content: 'PLAYERS CONTENT' },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newSocket = io.connect(`http://${window.location.hostname}:8080`);
      setSocket(newSocket);
      return () => newSocket.disconnect();
    } return null;
  }, []);

  useEffect(() => {
    if (socket && session && gameCode !== '') {
      socket.emit('join_room', { room: gameCode, user: JSON.stringify(session.data?.user) });
    }
  }, [socket, gameCode]);

  const color = gameData.player_1.id === session.data?.user.id
    ? gameData.player_1.color
    : gameData.player_2.color;

  return (
    <section className="w-full flex h-screen">
      <div className="flex flex-1">
        <div className="scale-90 flex-grow">
          <Board color={color} initialBoard={gameData.board} gameCode={gameCode} socket={socket} />
        </div>
        <div className="shadow-lg relative rounded-xl bg-gray-500 m-4 flex flex-col text-base text-gray-900">
          <div className="bg-gray-400 rounded-xl flex text-white font-semibold">
            <button type="button" onClick={() => setActiveTab('game')} className={`${activeTab === 'game' ? 'bg-gray-700' : 'bg-gray-600'} rounded-tl-xl flex-1 p-4`}>GAME</button>
            <button type="button" onClick={() => setActiveTab('games')} className={`${activeTab === 'games' ? 'bg-gray-700' : 'bg-gray-600'} flex-1 p-4`}>GAMES</button>
            <button type="button" onClick={() => setActiveTab('players')} className={`${activeTab === 'players' ? 'bg-gray-700' : 'bg-gray-600'} rounded-tr-xl flex-1 p-4`}>PLAYERS</button>
          </div>
          <div className="m-2 flex-grow">
            {tabs[activeTab].content}
          </div>
          <div className="flex-grow overflow-y-auto rounded-b-xl max-h-[375px]">
            <ChatWindow gameCode={gameCode} socket={socket} />
          </div>
        </div>
      </div>
    </section>
  );
}
