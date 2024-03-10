/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useRef } from 'react';
import { SendMessageButton } from './Buttons';

export default function ChatWindow({ gameCode, socket }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <section className="flex flex-col bg-gray-700 p-2 text-lg h-[375px]">
      <div className="flex-1 scrollbar-custom overflow-y-auto bg-gray-600 rounded-lg mb-2 pt-2">
        {messages.map((msg, index) => (
          <div key={`message-${index}`} className="pb-1 px-2" ref={index === messages.length - 1 ? lastMessageRef : null}>
            {msg.system ? (
              <span className="font-semibold text-green-300">
                {msg.message}
              </span>
            ) : (
              <div className="flex text-white">
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
      <div>
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            className="w-full rounded-lg border-slate-700 text-white bg-gray-600 p-2.5 pr-8 mr-2 placeholder:text-gray-400 border-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
            placeholder="Message"
            id="message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <SendMessageButton onClick={sendMessage} />
        </form>
      </div>
    </section>
  );
}
