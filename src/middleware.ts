import { NextRequest, NextResponse } from 'next/server';
import { Ratelimiter } from '@/lib/ratelimiter';

const limiter = new Ratelimiter({
  paths: {
    '/api/': { limit: 10, windowMs: 60_000 },
  },
});

export function middleware(request: NextRequest) {
  const result = limiter.evaluate(request);
  if (result && !result.isAllowed) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: result.headers,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
