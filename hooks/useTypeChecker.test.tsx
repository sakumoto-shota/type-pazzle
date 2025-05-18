import { renderHook, act } from '@testing-library/react';
import { useTypeChecker } from './useTypeChecker';
import { describe, expect, it, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('useTypeChecker', () => {
  const mockFetch = vi.fn();
  const mockShowError = vi.fn();

  beforeAll(() => {
    vi.stubGlobal('fetch', mockFetch);
    vi.stubGlobal('document', {
      cookie: 'csrf-token=test-token',
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    mockFetch.mockClear();
    mockShowError.mockClear();
  });

  it('handles successful type check', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: '✅ 型チェック成功!' }),
    });

    const { result } = renderHook(() => useTypeChecker(), { wrapper });

    await act(async () => {
      await result.current.checkType('type User = { name: string };');
    });

    expect(result.current.result).toEqual({
      success: true,
      message: '✅ 型チェック成功!',
    });
  });

  it('handles type check error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: '型チェックエラー' }),
    });

    const { result } = renderHook(() => useTypeChecker(), { wrapper });

    await act(async () => {
      await result.current.checkType('invalid code');
    });

    expect(result.current.result).toEqual({
      success: false,
      message: expect.stringContaining('エラー'),
    });
  });

  it('handles missing CSRF token', async () => {
    vi.stubGlobal('document', {
      cookie: '',
    });

    const { result } = renderHook(() => useTypeChecker(), { wrapper });

    await act(async () => {
      await result.current.checkType('type User = { name: string };');
    });

    expect(result.current.result).toEqual({
      success: false,
      message: expect.stringContaining('CSRFトークン'),
    });
  });
}); 