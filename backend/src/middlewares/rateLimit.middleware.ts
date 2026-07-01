import type { MiddlewareHandler } from "hono";

interface RateLimitInfo {
  attempts: number[];
}

const limiterCache = new Map<string, RateLimitInfo>();

// Clean up memory cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of limiterCache.entries()) {
    // Keep only attempts within last 30 minutes
    const validAttempts = value.attempts.filter((timestamp) => now - timestamp < 30 * 60 * 1000);
    if (validAttempts.length === 0) {
      limiterCache.delete(key);
    } else {
      value.attempts = validAttempts;
    }
  }
}, 5 * 60 * 1000).unref(); // unref prevents holding process open in tests

export function createRateLimiter(maxAttempts: number, windowMs: number): MiddlewareHandler {
  return async (c, next) => {
    const ip = c.req.header("x-forwarded-for") || "unknown-ip";
    const token = c.req.param("token") || "global";
    const key = `${ip}:${token}`;

    const now = Date.now();
    let record = limiterCache.get(key);

    if (!record) {
      record = { attempts: [] };
      limiterCache.set(key, record);
    }

    // Filter attempts to only include those in the current sliding window
    record.attempts = record.attempts.filter((timestamp) => now - timestamp < windowMs);

    if (record.attempts.length >= maxAttempts) {
      return c.json(
        { error: "Too many attempts. Please try again later." },
        429
      );
    }

    // Add current attempt timestamp
    record.attempts.push(now);

    await next();
  };
}
