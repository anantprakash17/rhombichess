import React, { useState, useEffect } from 'react';

export default function Timer({ timerDuration, timerRunning }) {
  const totalSeconds = timerDuration;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isTimerRunning, setTimerRunning] = useState(timerRunning);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      setTimerRunning(false);
      return () => {};
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const displayMin = Math.floor(timeLeft / 60);
  const displaySec = timeLeft % 60;

  return (
    <div>
      <h2 className="text-gray-800">
        {`${displayMin.toString().padStart(2, '0')}:${displaySec.toString().padStart(2, '0')}`}
      </h2>
    </div>
  );
}
