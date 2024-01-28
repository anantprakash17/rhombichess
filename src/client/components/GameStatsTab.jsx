import React, { useState } from 'react';
import Image from 'next/image';

export default function GameStatsTab({ gameCode, gamePassword }) {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (fieldType, field) => {
    await navigator.clipboard.writeText(field);
    setCopiedField(fieldType);
    setTimeout(() => setCopiedField(''), 1000);
  };

  return (
    <section className="m-2 h-1/2 flex-grow">
      <div>
        <span className="flex items-center">
          <button onClick={() => copyToClipboard(0, gameCode)} className="flex items-center" type="button">
            <span>
              GAME CODE:&nbsp;
              {gameCode}
            </span>
            {copiedField === 0 ? (
              <svg className="w-6 h-6 text-gray-800 dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4.7 4.5 9.3-9"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-800 dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 8v3c0 .6-.4 1-1 1H5m11 4h2c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1h-7a1 1 0 0 0-1 1v1m4 3v10c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1v-7.1c0-.3 0-.5.2-.7l2.5-2.9c.2-.2.5-.3.8-.3H13c.6 0 1 .4 1 1Z"/>
              </svg>
            )}
          </button>
        </span>
        {gamePassword && (
          <span className="flex items-center">
            <button onClick={() => copyToClipboard(1, gamePassword)} className="flex items-center" type="button">
              <span>
                GAME PASSWORD:&nbsp;
                {gamePassword}
              </span>
              {copiedField === 1 ? (
                <svg className="w-6 h-6 text-gray-800 dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4.7 4.5 9.3-9"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-800 dark:text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 8v3c0 .6-.4 1-1 1H5m11 4h2c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1h-7a1 1 0 0 0-1 1v1m4 3v10c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1v-7.1c0-.3 0-.5.2-.7l2.5-2.9c.2-.2.5-.3.8-.3H13c.6 0 1 .4 1 1Z"/>
                </svg>
              )}
            </button>
          </span>
        )}
      </div>
    </section>
  );
}
