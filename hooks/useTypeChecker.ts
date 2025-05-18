import { useState } from 'react';
import { useErrorToast } from '../src/hooks/useErrorToast';
import { TypeCheckRequestSchema, TypeCheckResponseSchema } from '../types/validation';

type TypeCheckResult = {
  success: boolean;
  message: string;
};

export const useTypeChecker = () => {
  const [result, setResult] = useState<TypeCheckResult | null>(null);
  const { showError } = useErrorToast();

  const checkType = async (code: string) => {
    try {
      // リクエストのバリデーション
      const requestValidation = TypeCheckRequestSchema.safeParse({ code });
      if (!requestValidation.success) {
        setResult({ success: false, message: `❌ エラー: ${requestValidation.error.errors[0].message}` });
        return;
      }

      // CSRFトークンの取得
      const cookies = document.cookie.split(';');
      const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrf-token='));
      if (!csrfCookie) {
        setResult({ success: false, message: '❌ エラー: CSRFトークンが見つかりません。ページを再読み込みしてください。' });
        return;
      }

      const csrfToken = csrfCookie.split('=')[1].trim();

      const res = await fetch('/api/typecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(requestValidation.data),
      });

      if (res.status === 403) {
        setResult({ success: false, message: '❌ エラー: CSRFトークンが無効です。ページを再読み込みしてください。' });
        return;
      }

      const data = await res.json();

      // レスポンスのバリデーション
      const responseValidation = TypeCheckResponseSchema.safeParse(data);
      if (!responseValidation.success) {
        setResult({ success: false, message: '❌ エラー: サーバーからの応答が不正です' });
        return;
      }

      setResult({ success: true, message: responseValidation.data.result });
    } catch (error) {
      showError(error);
      setResult({ success: false, message: '❌ エラー: 型チェック中にエラーが発生しました。' });
    }
  };

  return { result, checkType };
}; 