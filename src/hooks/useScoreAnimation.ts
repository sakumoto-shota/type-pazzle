import { useEffect, useState } from 'react';

export const useScoreAnimation = (
  finalScore: number,
  duration = 3000,
): number => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= duration) {
        clearInterval(interval);
        setScore(finalScore);
      } else {
        setScore(Math.floor(Math.random() * 101));
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [finalScore, duration]);

  return score;
};
