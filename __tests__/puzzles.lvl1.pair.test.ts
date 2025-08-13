import { describe, it, expect } from 'vitest';
import puzzles from '../data/puzzles.json';

// Lv1-4 specification tests for Pair puzzle

describe('Lv1-4 Pair puzzle spec', () => {
  it('uses non-generic Pair and correct code snippet', () => {
    const level1 = puzzles.levels.find((l) => l.level === 1);
    expect(level1).toBeTruthy();
    const target = level1!.puzzles[3];

    // Code must not contain generic Pair<...>
    expect(target.code).not.toMatch(/Pair\s*</);

    // Code must contain the exact snippet
    expect(target.code).toContain('type Pair = ???;');
    expect(target.code).toContain('const pair: Pair = [1, 2];');
  });

  it('has explanation mentioning both are number type', () => {
    const level1 = puzzles.levels.find((l) => l.level === 1);
    const target = level1!.puzzles[3];

    expect(target.explanation).toMatch(/両方がnumber型/);
  });
});
