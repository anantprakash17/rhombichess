/* eslint-disable max-len */

'use client';

import { React, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from './Board';
import ChatWindow from './ChatWindow';

const socket = io.connect('http://localhost:8080');


export default function Game({ lobbyCode, board }) {
  const [room, setRoom] = useState(lobbyCode);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newBoard, setBoard] = useState(board);

  const toggleChatWindow = () => {
    setIsChatVisible(!isChatVisible);
  };

  if (room !== '') {
    socket.emit('join_room', room);
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log('Received message');
      setMessages(data);
    });

    socket.on('receive_move', (data) => {
      console.log('Received move');
      setBoard(data);
    });
  }, [socket]);


  return (
    <section className="bg-whitebg-gray-900 w-full rounded-lg p-6">
      <Board pieces={newBoard} lobbyCode={lobbyCode} />
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
