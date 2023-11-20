/* eslint-disable max-len */

'use client';

import { React, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from './Board';
import ChatWindow from './ChatWindow';

const socket = io.connect('http://localhost:8080');

// Temporary JSON Response Example
const pieces = [['soldier-black', '', '', '', '', 'soldier-white'], ['elephant-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'elephant-white'], ['bishop-black', 'pawn-black', '', '', '', 'pawn-white', 'bishop-white'], ['elephant-black', 'shield-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'shield-white', 'elephant-white'], ['prince-black', 'soldier-black', '', '', '', '', 'soldier-white', 'prince-white'], ['rook-black', 'dog-black', 'cat-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'cat-white', 'dog-white', 'rook-white'], ['mammoth-black', 'shield-black', 'pawn-black', '', '', '', 'pawn-white', 'shield-white', 'mammoth-white'], ['queen-black', 'jester-black', 'machine-black', 'knight-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'knight-white', 'machine-white', 'jester-white', 'queen-white'], ['jester-black', 'cat-black', 'soldier-black', '', '', '', '', 'soldier-white', 'cat-white', 'jester-white'], ['king-black', 'jester-black', 'machine-black', 'knight-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'knight-white', 'machine-white', 'jester-white', 'king-white'], ['hawk-black', 'dog-black', 'pawn-black', '', '', '', 'pawn-white', 'dog-white', 'hawk-white'], ['rook-black', 'shield-black', 'cat-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'cat-white', 'shield-white', 'rook-white'], ['prince-black', 'soldier-black', '', '', '', '', 'soldier-white', 'prince-white'], ['bishop-black', 'dog-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'dog-white', 'bishop-white'], ['elephant-black', 'pawn-black', '', '', '', 'pawn-white', 'elephant-white'], ['bishop-black', 'pawn-black', '', '', '', '', '', '', '', '', 'pawn-white', 'bishop-white'], ['soldier-black', '', '', '', '', 'soldier-white']];

export default function Game({ lobbyCode }) {
  const [room, setRoom] = useState(lobbyCode);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleChatWindow = () => {
    setIsChatVisible(!isChatVisible);
  };

  if (room !== '') {
    socket.emit('join_room', room);
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });
  }, [socket]);

  return (
    <section className="bg-whitebg-gray-900 w-full rounded-lg p-6">
      <Board pieces={pieces} />
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
