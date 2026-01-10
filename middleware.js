
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Check if we are in admin section
  const isProtectedPath = path.startsWith('/admin');
  const isLoginPage = path === '/admin/login';

  // Check for auth cookie
  const token = request.cookies.get('admin_token')?.value;

  // 1. If trying to access any admin route (except login) and NOT logged in -> Redirect to Login
  if (isProtectedPath && !isLoginPage && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access Login page BUT ALREADY logged in -> Redirect to Dashboard
  if (isLoginPage && token) {
    const dashboardUrl = new URL('/admin/overview', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
