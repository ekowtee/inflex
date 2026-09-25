/**
 * Per-IP fixed-window rate limiting for the public form endpoints
 * (/api/contact, /api/careers/apply).
 *
 * In memory, per server process: good enough for one Node instance behind
 * Cloudflare, not a distributed limiter. Each call to createRateLimiter gets
 * its own window map, so one form's traffic never counts against another's.
 */

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetTime: number }>();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) hits.delete(key);
    }
  }, 10 * 60 * 1000);
  if (cleanup && typeof cleanup.unref === "function") cleanup.unref();

  return function check(key: string, now = Date.now()): RateLimitResult {
    const record = hits.get(key);
    if (!record || now > record.resetTime) {
      hits.set(key, { count: 1, resetTime: now + windowMs });
      return { ok: true };
    }
    if (record.count >= limit) {
      return { ok: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
    }
    record.count += 1;
    return { ok: true };
  };
}

/** The visitor's IP: Cloudflare's header first, then the usual proxies. */
export function getClientIp(req: { headers: Headers }): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
