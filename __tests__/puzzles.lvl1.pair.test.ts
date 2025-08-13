import { describe, it, expect } from 'vitest';
import puzzlesJson from '../data/puzzles.json';

type Puzzle = { code: string; explanation: string };
type Level = { level: number; puzzles: Puzzle[] };
type Puzzles = { levels: Level[] };

function getLevel(levels: Level[], levelNumber: number): Level | undefined {
  return levels.find((l) => l.level === levelNumber);
}

describe('Lv1-4 Pair puzzle specification', () => {
  const data = puzzlesJson as unknown as Puzzles;
  const lvl1 = getLevel(data.levels, 1);

  it('exists and is the fourth puzzle', () => {
    expect(lvl1).toBeDefined();
    if (!lvl1) return; // Narrow for type-safety
    expect(lvl1.puzzles.length).toBeGreaterThanOrEqual(4);
  });

  it('uses non-generic Pair and has correct code snippet', () => {
    if (!lvl1) return;
    const target = lvl1.puzzles[3];
    expect(target.code).not.toMatch(/Pair<[^>]*>/);
    expect(target.code).toContain('type Pair = ???;');
    expect(target.code).toContain('const pair: Pair = [1, 2];');
  });

  it('has explanation mentioning both elements are number', () => {
    if (!lvl1) return;
    const target = lvl1.puzzles[3];
    expect(target.explanation).toContain('両方がnumber型');
  });
});
