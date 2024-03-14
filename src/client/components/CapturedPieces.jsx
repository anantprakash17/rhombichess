import React from 'react';
import Image from 'next/image';

export default function CapturedPieces({ capturedPieces }) {
  return (
    <div className="w-full bg-gray-600 rounded-lg m-2 scrollbar-custom overflow-y-auto">
      {capturedPieces ? capturedPieces.map((piece, index) => (
        <div key={index} className="inline-flex">
          <Image 
            src={`/pieces/${piece}.png`} 
            alt={piece} 
            width={38} 
            height={18}
          />
        </div>
      )) : null}
    </div>
  );
}
