import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

let instance: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (instance) return instance;

  instance = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: env.REDIS_TLS ? {} : undefined,
    lazyConnect: true,
    connectTimeout: 10000,
  });

  instance.on("connect", () => logger.info("Redis connected"));
  instance.on("error", (err) => logger.error("Redis error", err));

  return instance;
}
