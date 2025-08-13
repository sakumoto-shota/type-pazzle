import dataJson from '../data/puzzles.json';

type Puzzle = { code: string; explanation: string };
type Level = { level: number; puzzles: Puzzle[] };
type PuzzlesData = { levels: Level[] };

describe('Lv1-4 Pair puzzle', () => {
  const data = dataJson as unknown as PuzzlesData;
  const level1 = data.levels.find((l) => l.level === 1);

  it('uses non-generic Pair (no Pair<...>)', () => {
    if (!level1) throw new Error('Level 1 not found');
    const target = level1.puzzles[3];
    expect(target.code.includes('Pair<')).toBe(false);
  });

  it('contains "const pair: Pair = [1, 2];"', () => {
    if (!level1) throw new Error('Level 1 not found');
    const target = level1.puzzles[3];
    expect(target.code.includes('const pair: Pair = [1, 2];')).toBe(true);
  });

  it('explanation mentions both are number type', () => {
    if (!level1) throw new Error('Level 1 not found');
    const target = level1.puzzles[3];
    expect(target.explanation.includes('両方がnumber型')).toBe(true);
  });
});

