import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@/lib/jwt';

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};

export async function middleware(req: NextRequest) {
  const jwt = req.cookies.get('token');

  if (!jwt) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    await verify(jwt.value, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}
