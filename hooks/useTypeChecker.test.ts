import { act, renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTypeChecker } from './useTypeChecker';

describe('useTypeChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('初期状態では結果が空文字列', () => {
    const { result } = renderHook(() => useTypeChecker());
    expect(result.current.result).toBe('');
  });

  it('型チェックが成功した場合、結果が表示される', async () => {
    const mockResponse = { result: '✅ 型チェック成功!' };
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useTypeChecker());

    await act(async () => {
      await result.current.checkType('type User = { name: string };');
    });

    expect(result.current.result).toBe('✅ 型チェック成功!');
  });

  it('APIエラーの場合、エラーメッセージが表示される', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useTypeChecker());

    await act(async () => {
      await result.current.checkType('type User = { name: string };');
    });

    expect(result.current.result).toBe('❌ エラー: API通信エラー');
  });

  it('空のコードの場合、バリデーションエラーが表示される', async () => {
    const { result } = renderHook(() => useTypeChecker());

    await act(async () => {
      await result.current.checkType('');
    });

    expect(result.current.result).toBe('❌ エラー: コードを入力してください');
  });
}); 