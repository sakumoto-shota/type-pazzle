import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface EditorProps {
  initialLevel?: number;
  initialScores?: number[];
}
