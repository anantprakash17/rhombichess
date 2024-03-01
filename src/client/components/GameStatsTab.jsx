import React, { useState } from 'react';

export default function GameStatsTab({ gameCode, gamePassword }) {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (fieldType, field) => {
    await navigator.clipboard.writeText(field);
    setCopiedField(fieldType);
    setTimeout(() => setCopiedField(''), 1000);
  };

  return (
    <section className="m-2 h-1/2 flex-grow">
      <div className="flex gap-4 justify-between">
        <button
          onClick={() => copyToClipboard('CODE', gameCode)}
          className="flex items-center bg-gray-300 px-2 py-1 rounded"
          type="button"
        >
          <span>
            {`Game Code: ${gameCode}`}
          </span>
          {copiedField === 'CODE' ? (
            <svg className="w-6 h-6 text-gray-700 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4.7 4.5 9.3-9" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 8v3c0 .6-.4 1-1 1H5m11 4h2c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1h-7a1 1 0 0 0-1 1v1m4 3v10c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1v-7.1c0-.3 0-.5.2-.7l2.5-2.9c.2-.2.5-.3.8-.3H13c.6 0 1 .4 1 1Z" />
            </svg>
          )}
        </button>
        {gamePassword && (
          <button
            onClick={() => copyToClipboard('PASSWORD', gamePassword)}
            className="flex items-center bg-gray-300 px-2 py-1 rounded"
            type="button"
          >
            <span>
              {`Game Password: ${gamePassword}`}
            </span>
            {copiedField === 'PASSWORD' ? (
              <svg className="w-6 h-6 text-gray-700 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4.7 4.5 9.3-9" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 8v3c0 .6-.4 1-1 1H5m11 4h2c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1h-7a1 1 0 0 0-1 1v1m4 3v10c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1v-7.1c0-.3 0-.5.2-.7l2.5-2.9c.2-.2.5-.3.8-.3H13c.6 0 1 .4 1 1Z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="mt-6">
        <span className="text-xl font-medium text-white">
          Moves
        </span>
        <div className="flex flex-col text-lg mt-2 gap-1 font-medium">
          <span className="text-gray-900 font-semibold">
            Black: King G12 to G19
          </span>
          <span className="text-gray-300">
            White: Rook E9 to K6
          </span>
          <span className="text-gray-900 font-semibold">
            Black: King G12 to G19
          </span>
          <span className="text-gray-300">
            White: Bishop E8 to F9
          </span>
          <span className="text-gray-900 font-semibold">
            Black: Knight D12 to H10
          </span>
        </div>
      </div>
      <div className="flex mt-24 w-full justify-center text-3xl">
        TIMER GOES HERE
      </div>
    </section>
  );
}
