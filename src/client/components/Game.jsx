/* eslint-disable consistent-return */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from './Board';
import ChatWindow from './ChatWindow';

export default function Game({ gameCode, initialBoard }) {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newSocket = io.connect(`http://${window.location.hostname}:8080`);
      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (socket && gameCode !== '') {
      socket.emit('join_room', gameCode);
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

  const toggleChatWindow = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <section className="bg-white w-full rounded-lg p-6">
      <Board initialBoard={initialBoard} gameCode={gameCode} socket={socket} />
      <button
        onClick={toggleChatWindow}
        className="fixed bottom-5 right-5 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        type="button"
      >
        {isChatVisible ? 'Hide Chat' : 'Show Chat'}
      </button>
      {isChatVisible && <ChatWindow gameCode={gameCode} toggleChatWindow={toggleChatWindow} messages={messages} />}
    </section>
  );
}
