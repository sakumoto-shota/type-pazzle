import { renderHook, act } from '@testing-library/react';
import { useScoreAnimation } from './useScoreAnimation';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useScoreAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns final score after duration', () => {
    const { result } = renderHook(() => useScoreAnimation(50, 1000));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(50);
  });
});
