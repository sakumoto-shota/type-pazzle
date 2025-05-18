import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'your-secret-key';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // トークンが存在しない場合は新規生成
  if (!request.cookies.get('csrf-token')) {
    const token = crypto.randomBytes(32).toString('hex');
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
}; 