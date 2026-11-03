// Simple in-memory rate limiting (use Redis in production)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = Date.now();
  const limit = rateLimits.get(identifier);

  // Clean up expired entries
  if (limit && now > limit.resetAt) {
    rateLimits.delete(identifier);
  }

  const current = rateLimits.get(identifier);

  if (!current) {
    rateLimits.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS) {
    return false;
  }

  current.count++;
  return true;
}

export function getRateLimitInfo(identifier: string): { remaining: number; resetAt: number } {
  const limit = rateLimits.get(identifier);
  const now = Date.now();

  if (!limit || now > limit.resetAt) {
    return { remaining: MAX_REQUESTS, resetAt: now + WINDOW_MS };
  }

  return {
    remaining: Math.max(0, MAX_REQUESTS - limit.count),
    resetAt: limit.resetAt,
  };
}
