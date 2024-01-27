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
              <Image src="/checkmark.svg" alt="Copied" width={15} height={15} className="ml-2" />
            ) : (
              <Image src="/copy.svg" alt="Copy game code" width={15} height={15} className="ml-2" />
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
                <Image src="/checkmark.svg" alt="Copied" width={15} height={15} className="ml-2" />
              ) : (
                <Image src="/copy.svg" alt="Copy game code" width={15} height={15} className="ml-2" />
              )}
            </button>
          </span>
        )}
      </div>
    </section>
  );
}
