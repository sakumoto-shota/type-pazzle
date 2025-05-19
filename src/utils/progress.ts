export const getScores = (): number[] | null => {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('scores='));
  return cookie ? cookie.split('=')[1].split('-').map((s) => parseInt(s, 10)) : null;
};

export const setScores = (scores: number[]): void => {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `scores=${scores.join('-')}; path=/`;
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
