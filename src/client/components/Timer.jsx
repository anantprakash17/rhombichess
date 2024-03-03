import React, { useState, useEffect } from 'react';

export default function Timer({ timerDuration }) {

  const [min, sec] = timerDuration.split(':').map(Number);
  const totalSeconds = min * 60 + sec;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [timerRunning, setTimerRunning] = useState(true);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) {
      setTimerRunning(false);
      return () => {};
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const displayMin = Math.floor(timeLeft / 60);
  const displaySec = timeLeft % 60;

  return (
    <div>
      <h2>{`${displayMin.toString().padStart(2, '0')}:${displaySec.toString().padStart(2, '0')}`}</h2>
    </div>
  );
};
