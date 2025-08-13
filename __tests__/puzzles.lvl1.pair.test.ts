import puzzlesData from '../data/puzzles.json';

describe('Lv1-4 Pair puzzle', () => {
  it('uses non-generic Pair (no Pair<...>)', () => {
    const level1 = puzzlesData.levels.find((lvl) => lvl.level === 1);
    if (!level1) throw new Error('Level 1 not found');
    const target = level1.puzzles[3];
    const code: string = target.code;
    const genericPattern = /Pair\s*<[^>]*>/;
    expect(genericPattern.test(code)).toBe(false);
  });

  it('contains const pair: Pair = [1, 2];', () => {
    const level1 = puzzlesData.levels.find((lvl) => lvl.level === 1);
    if (!level1) throw new Error('Level 1 not found');
    const target = level1.puzzles[3];
    const code: string = target.code;
    expect(code).toContain('const pair: Pair = [1, 2];');
  });

  it('explanation mentions 両方がnumber型', () => {
    const level1 = puzzlesData.levels.find((lvl) => lvl.level === 1);
    if (!level1) throw new Error('Level 1 not found');
    const target = level1.puzzles[3];
    const explanation: string = target.explanation;
    expect(explanation).toContain('両方がnumber型');
  });
});

