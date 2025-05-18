import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();
  
  // Edge Runtimeで動作するCSRFトークン生成
  const randomBytes = new Uint8Array(16);
  const csrfToken = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

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