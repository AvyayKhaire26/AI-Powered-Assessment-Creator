import IORedis from "ioredis";
import { logger } from "../utils/logger";

export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redisConnection.on("connect", () => {
  logger.info("Redis connected");
});

redisConnection.on("error", (err) => {
  logger.error("Redis error", err);
});