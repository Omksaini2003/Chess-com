import React, { useState, useCallback, useEffect, memo } from 'react';
import Countdown from "../components/Countdown";

interface CountdownWrapperProps {
  initialMinutes: number;
  isActive: boolean;
  onComplete: () => void;
  shouldReset: boolean;
}

const CountdownWrapper = memo(({ initialMinutes, isActive, onComplete, shouldReset }: CountdownWrapperProps) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  const onTick = useCallback(() => {
    setSeconds(prevSeconds => prevSeconds - 1);
  }, []);

  useEffect(() => {
    if (shouldReset) {
      setSeconds(initialMinutes * 60);
    }
  }, [shouldReset, initialMinutes]);

  return (
    <Countdown
      initialMinutes={initialMinutes}
      seconds={seconds}
      isActive={isActive}
      onTick={onTick}
      onComplete={onComplete}
    />
  );
});

export default CountdownWrapper;