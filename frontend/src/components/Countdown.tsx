import React, { useEffect, useCallback } from 'react';

interface CountdownProps {
  initialMinutes: number;
  seconds: number;
  isActive: boolean;
  onTick: () => void;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ initialMinutes, seconds, isActive, onTick, onComplete }) => {
  const formatTime = useCallback(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        onTick();
      }, 1000);
    } else if (seconds === 0) {
      onComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onTick, onComplete]);

  return (
    <div>
      <div className='text-white bg-red-400'>{formatTime()}</div>
    </div>
  );
};

export default Countdown;