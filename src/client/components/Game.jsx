/* eslint-disable consistent-return */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import Board from './Board';
import ChatWindow from './ChatWindow';

export default function Game({ gameCode, initialBoard }) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const session = useSession();
  const [activeTab,setActiveTab] = useState('GAME');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newSocket = io.connect(`http://${window.location.hostname}:8080`);
      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (socket && gameCode !== '') {
      socket.emit('join_room', { room: gameCode, name: session.data?.user?.name });
    }
  }, [socket, gameCode]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (data) => {
      setMessages(data);
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket]);

  return (
    <section className="w-full flex h-screen">
      <div className="flex flex-1">
        <div className="scale-90 ml-16 flex-grow">
          <Board initialBoard={initialBoard} gameCode={gameCode} socket={socket} />
        </div>
        <div className="rounded-3xl bg-gray-200 m-2 flex flex-col text-base text-gray-900">
          <div className="bg-gray-400 rounded-tr-3xl rounded-tl-3xl flex">
            <button type="button" onClick={() => setActiveTab('GAME')} className={`${activeTab === 'GAME' ? 'bg-gray-300' : 'bg-gray-400'} rounded-tl-3xl flex-1 px-4 p-2`}>GAME</button>
            <button type="button" onClick={() => setActiveTab('NEW GAME')} className={`${activeTab === 'NEW GAME' ? 'bg-gray-300' : 'bg-gray-400'} flex-1 px-4 p-2`}>NEW GAME</button>
            <button type="button" onClick={() => setActiveTab('GAMES')} className={`${activeTab === 'GAMES' ? 'bg-gray-300' : 'bg-gray-400'} flex-1 px-4 p-2`}>GAMES</button>
            <button type="button" onClick={() => setActiveTab('PLAYERS')} className={`${activeTab === 'PLAYERS' ? 'bg-gray-300' : 'bg-gray-400'} rounded-tr-3xl flex-1 px-4 p-2`}>PLAYERS</button>
          </div>
          <div className="m-2 h-1/2">
            {activeTab === 'GAME' && (
              <p>GAME CONTENT</p>
            )}
            {activeTab === 'NEW GAME' && (
              <p>NEW GAME CONTENT</p>
            )}
            {activeTab === 'GAMES' && (
              <p>GAMES CONTENT</p>
            )}
            {activeTab === 'PLAYERS' && (
              <p>PLAYERS CONTENT</p>
            )}
          </div>
          <div className="bg-gray-400 p-4">
            CHAT HEADER
          </div>
          <div className="flex-grow overflow-y-auto">
            <ChatWindow gameCode={gameCode} messages={messages} />
          </div>
        </div>
      </div>
    </section>
  );
}
