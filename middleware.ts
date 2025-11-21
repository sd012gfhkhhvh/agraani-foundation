import { NextResponse } from 'next/server';
import { auth as middleware } from '@/lib/auth';

export default middleware((request) => {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Get the subdomain
  const subdomain = hostname.split('.')[0];
  const isAdminSubdomain = subdomain === process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN || 
                           subdomain === 'admin' ||
                           hostname.startsWith('admin.');

  // Handle admin subdomain routing
  if (isAdminSubdomain && !pathname.startsWith('/admin')) {
    // Rewrite to /admin route
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - api/auth (auth routes)
     * - login (login page)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api/auth|login).*)' 
  ],
};
