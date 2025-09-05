import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get('user_id');

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  
  // If user is not authenticated and trying to access protected route
  if (!userCookie && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login page
  if (userCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.jpeg (logo file)
     * - logo.png (logo file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.jpeg|logo.png).*)',
  ],
};
