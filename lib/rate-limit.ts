const store = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = store.get(key) || [];

  // Clean up old entries
  const recentTimestamps = timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= limit) {
    store.set(key, recentTimestamps);
    return { allowed: false, remaining: 0 };
  }

  recentTimestamps.push(now);
  store.set(key, recentTimestamps);

  return {
    allowed: true,
    remaining: limit - recentTimestamps.length,
  };
}
