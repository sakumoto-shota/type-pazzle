import { renderHook, act } from '@testing-library/react';
import { useTypeChecker } from './useTypeChecker';
import { describe, expect, it, beforeEach, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('useTypeChecker', () => {
  const mockFetch = vi.fn();

  beforeAll(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('handles successful type check', async () => {
    document.cookie = 'csrf-token=test-token';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, result: '✅ 型チェック成功!' }),
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

  it('handles compile error from API', async () => {
    document.cookie = 'csrf-token=test-token';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: '型エラー' }),
    });

    const { result } = renderHook(() => useTypeChecker(), { wrapper });

    await act(async () => {
      await result.current.checkType('type User = { name: string }');
    });

    expect(result.current.result).toEqual({
      success: false,
      message: '❌ エラー: 型チェック中にエラーが発生しました。',
    });
  });

  it('handles type check error', async () => {
    document.cookie = 'csrf-token=test-token';
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
      message: '❌ エラー: 型チェック中にエラーが発生しました。',
    });
  });

  it('handles missing CSRF token', async () => {
    document.cookie = '';
    mockFetch.mockRejectedValueOnce(new Error('CSRFトークンが見つかりません'));

    const { result } = renderHook(() => useTypeChecker(), { wrapper });

    await act(async () => {
      await result.current.checkType('type User = { name: string };');
    });

    expect(result.current.result).toEqual({
      success: false,
      message: expect.stringContaining('❌ エラー: 型チェック中にエラーが発生しました。'),
    });
  });
}); 