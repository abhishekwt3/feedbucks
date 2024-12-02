import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop');
  const path = request.nextUrl.pathname;

  if (path === '/api/auth' && shop) {
    return NextResponse.next();
  }

  if (!shop && path !== '/install') {
    return NextResponse.redirect(new URL('/install', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!static|.*\\..*|_next|favicon.ico).*)',
    '/',
  ],
};

