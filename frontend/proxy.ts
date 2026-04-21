import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/auth'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next internals
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.gif|.*\\.css|.*\\.js|.*\\.woff|.*\\.woff2|.*\\.ttf).*)',
  ]
  };