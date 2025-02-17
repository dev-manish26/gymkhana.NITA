import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, req) {
    const metadata = (auth.sessionClaims as CustomJwtSessionClaims)?.metadata;
    const registered = !!auth.userId && metadata?.role !== undefined;

    // Redirect to Home Screen if user is not logged in and trying to access Onboarding Screen.
    if (!auth.userId && req.nextUrl.pathname === '/onboarding') {
      const home = new URL('/', req.url);
      return NextResponse.redirect(home);
    }

    // Redirect to Home Screen if user is logged in and has completed Onboarding process.
    if (registered && req.nextUrl.pathname === '/onboarding') {
      const home = new URL('/', req.url);
      return NextResponse.redirect(home);
    }

    // Redirect to Onboarding Screen if user is logged in and has not completed Onboarding process.
    if (
      !registered &&
      !auth.isPublicRoute &&
      req.nextUrl.pathname !== '/onboarding'
    ) {
      const dashboard = new URL('/onboarding', req.url);
      return NextResponse.redirect(dashboard);
    }
  },
  beforeAuth(req) {
    // Add x-pathname header to the request for getting the current pathname in the server.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  publicRoutes: [
    '/',
    '/gymkhanaPage',
    /^\/api.*$/,
    /^\/clubs.*$/,
    /^\/events.*$/,
    /^\/forms.*$/,
  ],
  ignoredRoutes: ['/api/og'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
