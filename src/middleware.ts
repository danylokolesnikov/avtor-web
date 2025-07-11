import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTE } from './shared/helpers/routers';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('kursach-authors')?.value;
  const response = NextResponse.next();

  response.cookies.set('hasToken', String(Number(Boolean(token))), {
    path: '/',
  });

  if (!token && request.nextUrl.pathname === ROUTE.dashboard) {
    return NextResponse.redirect(new URL(ROUTE.login, request.url));
  }

  if (token && request.nextUrl.pathname === ROUTE.login) {
    return NextResponse.redirect(new URL(ROUTE.dashboard, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all API routes
     */
    '/api/:path*',

    /*
     * Match all top-level and nested routes in `pages/`, but exclude static files and Next internals
     */
    '/((?!_next|favicon.ico|assets|images|fonts|.*\\..*).*)',
  ],
};
