/* eslint-disable react/no-array-index-key */
import React from 'react';
import Image from 'next/image';

export default function CapturedPieces({ capturedPieces }) {
  return (
    <div className="w-full bg-gray-600 rounded-lg ml-2 p-1 scrollbar-custom overflow-y-auto">
      {capturedPieces?.length ? capturedPieces.map((piece, index) => (
        <div key={`${index}-${piece}`} className="inline-flex">
          <Image
            src={`/pieces/${piece}.png`}
            alt={piece}
            width={38}
            height={18}
          />
        </div>
      )) : (
        <p className="w-full flex text-xl h-full items-center justify-center text-gray-800">
          No Captured Pieces
        </p>
      )}
    </div>
  );
}
