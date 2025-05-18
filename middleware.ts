import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 既存のCSRFトークンを取得
  const existingToken = request.cookies.get('csrf-token')?.value;
  let csrfToken = existingToken;

  // トークンが存在しない場合のみ新しいトークンを生成
  if (!csrfToken) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    csrfToken = `${timestamp}-${random}`;
  }

  // レスポンスの作成
  const response = NextResponse.next();

  // Cookieの設定（既存のトークンがある場合は更新しない）
  if (!existingToken) {
    response.cookies.set('csrf-token', csrfToken, {
      path: '/',
      sameSite: 'lax',
      maxAge: 3600,
      httpOnly: false,
    });
  }

  // レスポンスヘッダーにもトークンを設定
  response.headers.set('x-csrf-token', csrfToken);

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/', // トップページにもミドルウェアを適用
  ],
}; 