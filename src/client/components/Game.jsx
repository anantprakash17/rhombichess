/* eslint-disable max-len */

'use client';

import { React, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from './Board';
import ChatWindow from './ChatWindow';

const socket = io.connect('http://localhost:8080');


export default function Game({ lobbyCode, initialBoard }) {
  const [room, setRoom] = useState(lobbyCode);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [board, setBoard] = useState(initialBoard);

  const toggleChatWindow = () => {
    setIsChatVisible(!isChatVisible);
  };

  if (room !== '') {
    socket.emit('join_room', room);
  }

  useEffect(() => {
    const handleMessage = (data) => {
      console.log('Received message');
      setMessages(data);
    };
  
    socket.on('receive_message', handleMessage);
  
    // Cleanup function
    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket]);


  return (
    <section className="bg-whitebg-gray-900 w-full rounded-lg p-6">
      <Board pieces={board} lobbyCode={lobbyCode} socket={socket} />
      <button
        onClick={toggleChatWindow}
        className="fixed bottom-5 right-5 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        type="button"
      >
        {isChatVisible ? 'Hide Chat' : 'Show Chat'}
      </button>
      {isChatVisible && <ChatWindow lobbyCode={lobbyCode} toggleChatWindow={toggleChatWindow} messages={messages} /> }
    </section>
  );
}
