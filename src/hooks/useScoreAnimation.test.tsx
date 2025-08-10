import { renderHook } from '@testing-library/react';
import { useScoreAnimation } from './useScoreAnimation';
import { describe, it, expect } from 'vitest';

describe('useScoreAnimation', () => {
  it('returns final score immediately', () => {
    const { result } = renderHook(() => useScoreAnimation(50));
    // アニメーションを削除したので、即座に最終スコアが返される
    expect(result.current).toBe(50);
  });
});
