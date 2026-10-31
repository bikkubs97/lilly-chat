import { NextRequest } from "next/server";

const RATE_LIMIT_BUCKETS = new Map<string, { count: number; resetAt: number }>();

export function getRequestIdentifier(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const realIp = req.headers.get("x-real-ip") || "";
  const candidate = forwardedFor.split(",")[0]?.trim() || realIp.trim() || "unknown";

  return candidate || "unknown";
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = RATE_LIMIT_BUCKETS.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    RATE_LIMIT_BUCKETS.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
