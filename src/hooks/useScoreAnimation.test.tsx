import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useScoreAnimation } from './useScoreAnimation';

describe('useScoreAnimation', () => {
  it('returns final score after duration', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScoreAnimation(50, 1000));
    vi.advanceTimersByTime(1000);
    expect(result.current).toBe(50);
    vi.useRealTimers();
  });
});
