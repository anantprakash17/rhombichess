/* eslint-disable react/no-array-index-key */
import React from 'react';
import Image from 'next/image';

export default function MoveStack({ moveStack, endOfMoves }) {
  return (
    <>
      {moveStack && moveStack.map((move, index) => (
        <div key={index}>
          <div className="flex justify-left items-center flex-wrap">
            <div className="inline-flex">
              <Image
                src={`/pieces/${move.piece}.png`}
                alt={move.piece}
                width={38}
                height={18}
              />
            </div>
            <div className="flex items-center">
              {!move.piece_promoted
                && (
                <p className="ml-2">
                    {`${move.start}-${move.end}`}
                </p>
                )}
              {move.piece_affected && (
              <div className="inline-flex items-center ml-2 mr-2">
                {(move.piece_promoted && (
                <>
                  <p className="mr-2">{move.start}</p>
                  {' '}
                  <p className="bg-gray-200 px-1 rounded mr-2">pr</p>
                </>
                )) || (<p className="bg-gray-200 px-1 rounded mr-1"> x </p>)}
                <Image
                  src={`/pieces/${move.piece_affected}.png`}
                  alt={move.piece_affected}
                  width={38}
                  height={18}
                />
                {move.check && <p className="bg-gray-200 px-1 rounded text-red-600 ml-1"> ch </p>}
              </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={endOfMoves} />
    </>
  );
}
