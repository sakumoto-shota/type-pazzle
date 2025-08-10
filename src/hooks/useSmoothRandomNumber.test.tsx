/* global requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout */
import { renderHook, act } from '@testing-library/react';
import { useSmoothRandomNumber } from './useSmoothRandomNumber';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useSmoothRandomNumber', () => {
  let originalRAF: typeof requestAnimationFrame;
  let originalCAF: typeof cancelAnimationFrame;

  beforeEach(() => {
    // requestAnimationFrame/cancelAnimationFrameをsetTimeout/clearTimeoutでモック
    originalRAF = globalThis.requestAnimationFrame;
    originalCAF = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = (cb) =>
      setTimeout(() => cb(Date.now()), 0) as unknown as number;
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id as unknown as number);
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
  });

  it('returns a different value after interval', async () => {
    const { result } = renderHook(() => useSmoothRandomNumber(10));
    const first = result.current;

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    const second = result.current;
    expect(first).not.toBe(second);

    vi.useRealTimers();
  });
});
