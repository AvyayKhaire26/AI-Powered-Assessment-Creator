import { connectDB } from "./db";
import { assignmentQueue } from "./queue";
import { logger } from "../utils/logger";

export const initServices = async () => {
  await connectDB();

  logger.info("MongoDB initialized");

  logger.info("Queue initialized");

  assignmentQueue.on("error", (err) => {
    logger.error("Queue error", err);
  });
};