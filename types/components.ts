import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface PuzzleResult {
  puzzleIndex: number;
  isCorrect: boolean;
  explanation: string;
  code: string;
}

export interface LevelResults {
  level: number;
  results: PuzzleResult[];
}

export interface EditorProps {
  initialLevel?: number;
  initialScores?: number[];
  initialResults?: LevelResults[];
}
