import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getScores, setScores, getLevel, setLevel, resetProgress, getResults, setResults } from './progress';
import type { LevelResults } from '../../types/components';

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
    setScores([10, 20, 0, 0, 0]);
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

  it('reads and writes results', () => {
    const mockResults: LevelResults[] = [
      {
        level: 1,
        results: [
          {
            puzzleIndex: 0,
            isCorrect: true,
            explanation: 'Test explanation',
            code: 'test code',
          },
        ],
      },
    ];
    
    vi.stubGlobal('document', { cookie: '' });
    setResults(mockResults);
    expect(document.cookie).toContain('results=');
    
    const encodedResults = encodeURIComponent(JSON.stringify(mockResults));
    vi.stubGlobal('document', { cookie: `results=${encodedResults}` });
    expect(getResults()).toEqual(mockResults);
  });
  
  it('handles invalid results cookie', () => {
    vi.stubGlobal('document', { cookie: 'results=invalid-json' });
    expect(getResults()).toBeNull();
  });
  
  it('resets progress to defaults', () => {
    const mockCookie = { value: '' };
    vi.stubGlobal('document', {
      get cookie() {
        return mockCookie.value;
      },
      set cookie(val: string) {
        mockCookie.value = val;
      },
    });
    
    mockCookie.value = 'scores=10-20-0-0-0; level=2; results=test';
    resetProgress();
    
    // resetProgressは複数のcookieを設定するので、最後に設定されたものをチェック
    expect(mockCookie.value).toContain('max-age=0');
  });
});
