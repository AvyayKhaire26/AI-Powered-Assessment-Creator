import { connectDB } from "./db";
import { getRedisConnection } from "./redis";
import { logger } from "../utils/logger";

export const initServices = async (): Promise<void> => {
  await connectDB();

  await getRedisConnection().ping();
  logger.info("Redis initialized");
};

export { getRedisConnection };
