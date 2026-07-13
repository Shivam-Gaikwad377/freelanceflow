// hooks/useElapsedSeconds.ts
import { useState, useEffect } from 'react';

export function useElapsedSeconds(startTime: string | null) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const start = new Date(startTime).getTime();

    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick(); // avoid a 1s flash of 0 on mount

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
}