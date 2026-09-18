// In-memory sliding window rate limiter for API endpoints (e.g. OTP, Checkout, Login)

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  identifier: string,
  limit: number = 3,
  windowSeconds: number = 120
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = rateLimitStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count < limit) {
    existing.count += 1;
    return {
      success: true,
      remaining: limit - existing.count,
      retryAfterSeconds: 0,
    };
  }

  const retryAfterSeconds = Math.ceil((existing.resetTime - now) / 1000);
  return {
    success: false,
    remaining: 0,
    retryAfterSeconds: Math.max(retryAfterSeconds, 1),
  };
}
