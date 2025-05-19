import { useEffect, useRef, useState } from 'react';

/**
 * Returns a random number updated at a given interval using requestAnimationFrame
 * to minimize stutter.
 * @param intervalMs Interval in milliseconds between updates
 */
export function useSmoothRandomNumber(intervalMs: number = 1000): number {
  const [value, setValue] = useState<number>(() => Math.random());
  const frameId = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const loop = (time: number): void => {
      if (time - lastTimeRef.current >= intervalMs) {
        setValue(Math.random());
        lastTimeRef.current = time;
      }
      frameId.current = requestAnimationFrame(loop);
    };
    frameId.current = requestAnimationFrame(loop);
    return () => {
      if (frameId.current !== undefined) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [intervalMs]);

  return value;
}
