import puzzlesData from '../../data/puzzles.json';

const TOTAL_LEVELS = puzzlesData.levels.length;

export const getScores = (): number[] | null => {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('scores='));
  if (!cookie) {
    return null;
  }
  const values = cookie
    .split('=')[1]
    .split('-')
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
  const scores = new Array<number>(TOTAL_LEVELS).fill(0);
  values.forEach((v, i) => {
    if (i < TOTAL_LEVELS) {
      scores[i] = v;
    }
  });
  return scores;
};

export const setScores = (scores: number[]): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const normalized = new Array<number>(TOTAL_LEVELS).fill(0);
  scores.forEach((s, i) => {
    if (!Number.isNaN(s) && i < TOTAL_LEVELS) {
      normalized[i] = s;
    }
  });
  document.cookie = `scores=${normalized.join('-')}; path=/`;
};

export const getLevel = (): number | null => {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('level='));
  if (!cookie) {
    return null;
  }
  const level = parseInt(cookie.split('=')[1], 10);
  return Number.isNaN(level) ? null : level;
};

export const setLevel = (level: number | null): void => {
  if (typeof document === 'undefined') {
    return;
  }
  if (level === null) {
    document.cookie = 'level=; path=/; max-age=0';
  } else {
    document.cookie = `level=${level}; path=/`;
  }
};
