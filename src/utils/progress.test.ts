import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getScores, setScores, getLevel, setLevel } from './progress';

beforeEach(() => {
  document.cookie = '';
});

afterEach(() => {
  document.cookie = '';
  vi.unstubAllGlobals();
});

describe('progress utils', () => {
  it('reads and writes scores', () => {
    vi.stubGlobal('document', { cookie: '' });
    setScores([10, 20]);
    expect(document.cookie).toContain('scores=10-20-0-0-0');
    vi.stubGlobal('document', { cookie: 'scores=10-20-0-0-0' });
    expect(getScores()).toEqual([10, 20, 0, 0, 0]);
  });

  it('reads and writes level', () => {
    vi.stubGlobal('document', { cookie: '' });
    setLevel(2);
    expect(document.cookie).toContain('level=2');
    vi.stubGlobal('document', { cookie: 'level=2' });
    expect(getLevel()).toBe(2);
  });

  it('handles missing cookie', () => {
    vi.stubGlobal('document', { cookie: '' });
    expect(getScores()).toBeNull();
    expect(getLevel()).toBeNull();
  });
});
