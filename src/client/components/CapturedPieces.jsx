import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CapturedPieces({ capturedPieces }) {
  return (
    <div className="w-full bg-gray-600 rounded-lg mb-2 pt-2 m-2 scrollbar-custom overflow-y-auto">
      {capturedPieces.map((piece, index) => (
        <div key={index} className="inline-flex">
          <Image 
            src={`/pieces/${piece}.png`} 
            alt={piece} 
            width={38} 
            height={18}
          />
        </div>
      ))}
    </div>
  )
}
