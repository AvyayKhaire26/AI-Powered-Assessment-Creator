import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: env.REDIS_TLS ? {} : undefined,
  lazyConnect: true,          // don't connect until first command
  keepAlive: 10000,           // reduce reconnect chatter
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 500, 5000),
});

redisConnection.on("connect", () => logger.info("Redis connected"));
redisConnection.on("error", (err) => logger.error("Redis error", err));
