import { useState } from 'react';
import { TypeCheckRequestSchema, TypeCheckResponseSchema } from '../types/validation';

type TypeCheckResult = {
  success: boolean;
  message: string;
};

export const useTypeChecker = () => {
  const [result, setResult] = useState<TypeCheckResult | null>(null);

  const checkType = async (code: string) => {
    try {
      // リクエストのバリデーション
      const requestValidation = TypeCheckRequestSchema.safeParse({ code });
      if (!requestValidation.success) {
        setResult({ success: false, message: `❌ エラー: ${requestValidation.error.errors[0].message}` });
        return;
      }

      const res = await fetch('/api/typecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.cookie.split('; ').find(row => row.startsWith('csrf-token='))?.split('=')[1] ?? '',
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
    } catch {
      setResult({ success: false, message: '❌ エラー: 型チェック中にエラーが発生しました。' });
    }
  };

  return { result, checkType };
}; 