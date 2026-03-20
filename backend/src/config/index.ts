import { connectDB } from "./db";
import { redisConnection } from "./redis";
import { assignmentQueue } from "./queue";
import { logger } from "../utils/logger";

export const initServices = async (): Promise<void> => {
  await connectDB();

  await redisConnection.ping();
  logger.info("Redis initialized");

  assignmentQueue.on("error", (err) => logger.error("Queue error", err));
  logger.info("BullMQ queue initialized");
};

export { redisConnection, assignmentQueue };
