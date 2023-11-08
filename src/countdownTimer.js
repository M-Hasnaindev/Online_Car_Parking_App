import React, { useState, useEffect } from 'react';

function CountdownTimer({ duration, onTimerEnd }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}minutes:${seconds < 10 ? `0${seconds}` : seconds}second`;
  };

  return <div>{formatTime(timeLeft)}</div>;
}

export default CountdownTimer