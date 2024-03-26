/* eslint-disable consistent-return */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Timer from './Timer';
import CapturedPieces from './CapturedPieces';
import MoveStack from './MoveStack';

export default function GameStatsTab({ gameData, socket }) {
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeftP1, setTimeLeftP1] = useState(gameData?.player_1?.timer_duration);
  const [timeLeftP2, setTimeLeftP2] = useState(gameData?.player_2?.timer_duration);
  const [timerRunningP1, setTimerRunningP1] = useState(gameData?.player_1?.timer_running);
  const [timerRunningP2, setTimerRunningP2] = useState(gameData?.player_2?.timer_running);
  const [turn, setTurn] = useState(gameData?.turn);

  const [capturedP1, setCapturedP1] = useState(null);
  const [capturedP2, setCapturedP2] = useState(null);

  const [moveStack, setMoveStack] = useState(null);
  const endOfMoves = useRef(null);

  useEffect(() => {
    if (gameData?.player_1?.color === 'white') {
      setCapturedP1(gameData?.captured_pieces?.black);
      setCapturedP2(gameData?.captured_pieces?.white);
    } else {
      setCapturedP1(gameData?.captured_pieces?.white);
      setCapturedP2(gameData?.captured_pieces?.black);
    }
  }, [gameData]);

  useEffect(() => {
    endOfMoves.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moveStack]);

  useEffect(() => {
    if (!socket || !gameData) return;

    const handleTimerUpdate = (data) => {
      setTimeLeftP1(data.timer_duration_p1);
      setTimeLeftP2(data.timer_duration_p2);
      setTimerRunningP1(data.timer_running_p1);
      setTimerRunningP2(data.timer_running_p2);

      setMoveStack(data.move_stack);

      setTurn(data?.turn);
      if (gameData?.player_1?.color === 'white') {
        setCapturedP1(data?.captured_pieces?.black);
        setCapturedP2(data?.captured_pieces?.white);
      } else if (gameData?.player_1?.color === 'black') {
        setCapturedP1(data?.captured_pieces?.white);
        setCapturedP2(data?.captured_pieces?.black);
      }
    };

    socket.on('timer_update', handleTimerUpdate);

    return () => {
      socket.off('timer_update', handleTimerUpdate);
    };
  }, [socket]);

  const copyToClipboard = async (fieldType, field) => {
    await navigator.clipboard.writeText(field);
    setCopiedField(fieldType);
    setTimeout(() => setCopiedField(''), 1000);
  };

  return (
    <section className="m-2 h-1/2 flex-grow">
      <div className="flex gap-4 justify-between">
        <button
          onClick={() => copyToClipboard('CODE', gameData?.game_id)}
          className="flex items-center bg-gray-300 px-2 py-1 rounded"
          type="button"
        >
          <span>
            {`Game Code: ${gameData?.game_id}`}
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
        {gameData?.password && (
          <button
            onClick={() => copyToClipboard('PASSWORD', gameData?.password)}
            className="flex items-center bg-gray-300 px-2 py-1 rounded"
            type="button"
          >
            <span>
              {`Game Password: ${gameData?.password}`}
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
      <div className="flex flex-col w-full text-2xl font-bold mt-6">
        <div className="flex flex-1 items-center justify-between">
          <div className={`flex flex-col items-center justify-center rounded-lg h-[163px] ${turn === gameData?.player_1?.color && 'bg-green-300'}`}>
            <Image src={`/pieces/pawn-${gameData?.player_1?.color}.png`} alt="pawn1" width={80} height={60} />
            {gameData.timed_game ? (
              <Timer
                key={`${timeLeftP1}, ${timerRunningP1}`}
                timerDuration={timeLeftP1}
                timerRunning={timerRunningP1}
              />
            ) : null }
          </div>
          <div className="flex flex-1 justify-center h-[180px]">
            <CapturedPieces capturedPieces={capturedP1} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className={`flex flex-col items-center justify-center rounded-lg h-[163px] ${turn === gameData?.player_2?.color && 'bg-green-300'}`}>
            <Image src={`/pieces/pawn-${gameData?.player_2?.color}.png`} alt="pawn2" width={80} height={60} />
            {gameData.timed_game ? (
              <Timer
                key={`${timeLeftP2}, ${timerRunningP2}`}
                timerDuration={timeLeftP2}
                timerRunning={timerRunningP2}
              />
            ) : null }
          </div>
          <div className="flex flex-1 justify-center h-[180px]">
            <CapturedPieces capturedPieces={capturedP2} />
          </div>
        </div>
      </div>
      <div className="overflow-auto min-h-[155px] max-h-[300px] scrollbar-custom bg-gray-300 px-2 py-1 rounded">
        <MoveStack moveStack={moveStack} endOfMoves={endOfMoves} />
      </div>
    </section>
  );
}
