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
                            {!move.piece_promoted &&
                                <p>
                                    {`moved from ${move.start} to ${move.end}`}
                                </p>
                            }
                            {move.piece_affected && (
                                <div className="inline-flex items-center ml-2">
                                    {move.piece_promoted && <p>at {move.start} was promoted to </p> || <p> and captured </p>}
                                    <Image
                                        src={`/pieces/${move.piece_affected}.png`}
                                        alt={move.piece_affected}
                                        width={38}
                                        height={18}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {move.check && 
                        <div className="flex items-center text-red-600">
                            <Image
                            src={`/pieces/${move.piece}.png`}
                            alt={move.piece}
                            width={38}
                            height={18}
                            /> 
                            <p className="text-shadow-md">put the opponent's King in CHECK!</p>
                        </div>
                    }
                </div>
            ))}
            <div ref={endOfMoves}></div>
        </>
    );
}