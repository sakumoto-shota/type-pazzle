import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();
  
  // Web Crypto APIを使用してランダムな文字列を生成
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const nonce = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  response.headers.set('x-nonce', nonce);
  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 