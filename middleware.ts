import crypto from 'crypto';
import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();

  // CSRFトークンを生成してCookieに設定
  const csrfToken = crypto.randomUUID();
  response.cookies.set('csrf-token', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 