/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import { useSession } from 'next-auth/react';
import { React, useEffect, useState } from 'react';

export default function ChatWindow({ gameCode, socket }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const session = useSession();

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

  const sendMessage = (event) => {
    event.preventDefault();

    socket.emit('send_message', { message, room: gameCode, user: JSON.stringify(session.data?.user) });
    setMessage('');
  };

  return (
    <section className="flex flex-col h-full bg-gray-400 p-2">
      <div className="flex-1 overflow-y-auto bg-gray-200 rounded-lg mb-2 pt-2">
        {messages.map((msg, index) => (
          <div key={`message-${index}`} className="pb-1 px-2">
            {msg.system ? (
              <span className="font-semibold text-red-400">
                {msg.message}
              </span>
            ) : (
              <div className="flex">
                <span className="pr-2">
                  {`${msg.user_name}:`}
                </span>
                <span>
                  {msg.message}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <form action="message" onSubmit={sendMessage}>
          <input
            className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pr-12 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Message"
            id="message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
        </form>
      </div>
    </section>
  );
}
