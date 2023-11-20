'use client';

import io from 'socket.io-client';
import { React, useEffect, useState } from 'react';
import { SendMessageButton } from './Buttons';

const socket = io.connect('http://localhost:8080');

export default function ChatWindow({ lobbyCode, toggleChatWindow, messages }) {
  const [message, setMessage] = useState('');

  const [room, setRoom] = useState(lobbyCode);

  const sendMessage = () => {
    socket.emit('send_message', { message, room });
    setMessage('');
  };

  return (
    <section className="border-2 fixed bottom-5 right-5 w-64 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <div className="flex justify-end items-center p-2">
        <button
          onClick={toggleChatWindow}
          className="absolute top-2 right-2 text-black pt-6 p-2 rounded-md"
          type="button"
        >
          <span className="block bg-black h-0.5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto mt-2">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <span>{msg}</span>
          </div>
        ))}
      </div>
      <input
        className="mb-4 block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Message"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <SendMessageButton onClick={sendMessage} />
    </section>
  );
}
