import { Request, Response, NextFunction } from "express";
import { getRedisConnection } from "../config/redis";
import { logger } from "../utils/logger";

interface TokenBucketConfig {
  capacity: number;
  refillRate: number;
  windowSecs: number;
}

const DEFAULT_CONFIG: TokenBucketConfig = {
  capacity: 20,
  refillRate: 10,
  windowSecs: 60,
};

export function rateLimitMiddleware(config: TokenBucketConfig = DEFAULT_CONFIG) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `ratelimit:${ip}`;

    try {
      const now = Math.floor(Date.now() / 1000);
      const raw = await getRedisConnection().get(key);

      let tokens: number;
      let lastRefill: number;

      if (!raw) {
        tokens = config.capacity - 1;
        lastRefill = now;
      } else {
        const bucket = JSON.parse(raw);
        const elapsed = now - bucket.lastRefill;
        const refilled = Math.floor(elapsed / config.windowSecs) * config.refillRate;

        tokens = Math.min(config.capacity, bucket.tokens + refilled);
        lastRefill = refilled > 0 ? now : bucket.lastRefill;

        if (tokens <= 0) {
          logger.warn(`Rate limit exceeded for IP: ${ip}`);
          res.status(429).json({
            success: false,
            message: "Too many requests. Please slow down.",
          });
          return;
        }

        tokens -= 1;
      }

      await getRedisConnection().setex(
        key,
        config.windowSecs * 2,
        JSON.stringify({ tokens, lastRefill })
      );

      res.setHeader("X-RateLimit-Limit", config.capacity);
      res.setHeader("X-RateLimit-Remaining", tokens);

      next();
    } catch (error) {
      logger.error(`Rate limiter error for IP ${ip}: ${error}`);
      next();
    }
  };
}
