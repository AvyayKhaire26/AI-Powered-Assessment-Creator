import { Queue } from "bullmq";

const redisPort = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 6379;

if (isNaN(redisPort)) {
  throw new Error("REDIS_PORT is invalid");
}

export const assignmentQueue = new Queue("assignment-queue", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: redisPort,
  },
});