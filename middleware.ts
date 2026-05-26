import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rate Limiting for API routes
  if (nextUrl.pathname.startsWith('/api/')) {
    // Get IP or fallback to 'unknown'
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Default limit: 100 requests per 15 minutes
    const { allowed } = rateLimit(`global-api-${ip}`, 100, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز حد المحاولات. حاول مرة أخرى لاحقاً' },
        { status: 429 }
      );
    }

    // We let the API route handle itself if rate limit passes.
    return NextResponse.next();
  }

  // Setup wizard auth guard
  if (nextUrl.pathname.startsWith('/setup')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Update matcher to include API routes, but still exclude static files and images
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
