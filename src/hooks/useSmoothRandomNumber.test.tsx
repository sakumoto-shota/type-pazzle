import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSmoothRandomNumber } from './useSmoothRandomNumber';

describe('useSmoothRandomNumber', () => {
  it('updates value over time', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSmoothRandomNumber(1000));

    const first = result.current;
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const second = result.current;
    expect(first).not.toBe(second);

    vi.useRealTimers();
  });
});
