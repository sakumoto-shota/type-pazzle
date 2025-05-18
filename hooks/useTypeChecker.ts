import { useState } from 'react';
import { TypeCheckRequestSchema, TypeCheckResponseSchema } from '../types/validation';

export const useTypeChecker = () => {
  const [result, setResult] = useState<string>('');

  const checkType = async (code: string) => {
    try {
      // リクエストのバリデーション
      const requestValidation = TypeCheckRequestSchema.safeParse({ code });
      if (!requestValidation.success) {
        setResult(`❌ エラー: ${requestValidation.error.errors[0].message}`);
        return;
      }

      const res = await fetch('/api/typecheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.cookie.split('; ').find(row => row.startsWith('csrf-token='))?.split('=')[1] || '',
        },
        credentials: 'include',
        body: JSON.stringify(requestValidation.data),
      });

      if (res.status === 403) {
        setResult('❌ エラー: CSRFトークンが無効です。ページを再読み込みしてください。');
        return;
      }

      const data = await res.json();

      // レスポンスのバリデーション
      const responseValidation = TypeCheckResponseSchema.safeParse(data);
      if (!responseValidation.success) {
        setResult('❌ エラー: サーバーからの応答が不正です');
        return;
      }

      setResult(responseValidation.data.result);
    } catch (e) {
      setResult('❌ エラー: API通信エラー');
    }
  };

  return { result, checkType };
}; 