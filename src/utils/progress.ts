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

export const resetProgress = (): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const zeroScores = new Array<number>(TOTAL_LEVELS).fill(0);
  setScores(zeroScores);
  setLevel(1);
  setResults({});
};

// 詳細な結果を保存する型定義
export interface PuzzleResult {
  answer: boolean;
  puzzleIndex: number;
  description?: string;
}

export interface LevelResults {
  [level: string]: PuzzleResult[];
}

// 詳細な結果を取得
export const getResults = (): LevelResults | null => {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('results='));
  if (!cookie) {
    return null;
  }
  try {
    const encoded = cookie.split('=')[1];
    const decoded = decodeURIComponent(encoded);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to parse results cookie:', e);
    return null;
  }
};

// 詳細な結果を保存
export const setResults = (results: LevelResults): void => {
  if (typeof document === 'undefined') {
    return;
  }
  try {
    const json = JSON.stringify(results);
    const encoded = encodeURIComponent(json);
    document.cookie = `results=${encoded}; path=/; max-age=86400`; // 1日保存
  } catch (e) {
    console.error('Failed to save results cookie:', e);
  }
};
