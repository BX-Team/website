import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? '127.0.0.1';

  if (request.nextUrl.pathname.startsWith('/v2/')) {
    const rateLimitResult = rateLimit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        },
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/v2/:path*',
};
