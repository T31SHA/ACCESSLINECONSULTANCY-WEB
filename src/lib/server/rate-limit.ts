import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limiter =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "alc:rl",
        analytics: false,
      })
    : null;

/** 5 submissions / 10 min per IP + route. No-op without Upstash env. */
export async function rateLimit(key: string) {
  if (!limiter) return { success: true };
  return limiter.limit(key);
}
