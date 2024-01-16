/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import io from 'socket.io-client';
import { React, useEffect, useState } from 'react';
import { SendMessageButton } from './Buttons';

export default function ChatWindow({ gameCode, messages }) {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState(gameCode);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newSocket = io.connect(`http://${window.location.hostname}:8080`);
      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, []);

  const sendMessage = () => {
    socket.emit('send_message', { message, room });
    setMessage('');
  };

  return (
    <section className="flex flex-col h-full p-2">
      <div className="flex-1 overflow-y-auto mt-2">
        {messages.map((msg, index) => (
          <div key={`message-${index}`} className="flex items-center space-x-2 mb-2 mx-2">
            <span>
              {msg}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <input
          className="mb-2 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <SendMessageButton onClick={sendMessage} />
      </div>
    </section>
  );
}
