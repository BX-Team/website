const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = 10000; // 10 seconds in milliseconds

export function rateLimit(ip: string): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });

    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS - 1,
      reset: Math.floor((now + RATE_LIMIT_WINDOW) / 1000),
    };
  }

  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return {
      success: false,
      limit: RATE_LIMIT_REQUESTS,
      remaining: 0,
      reset: Math.floor(userLimit.resetTime / 1000),
    };
  }

  userLimit.count++;

  return {
    success: true,
    limit: RATE_LIMIT_REQUESTS,
    remaining: RATE_LIMIT_REQUESTS - userLimit.count,
    reset: Math.floor(userLimit.resetTime / 1000),
  };
}

setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
);
