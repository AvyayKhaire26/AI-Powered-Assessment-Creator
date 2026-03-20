import { Queue } from "bullmq";
import { env } from "./env";

const sharedConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: env.REDIS_TLS ? {} : undefined,
  lazyConnect: true,
  keepAlive: 10000,
};

export { sharedConnection };

export const assignmentQueue = new Queue("assignment-generation", {
  connection: sharedConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 100 },
  },
});
