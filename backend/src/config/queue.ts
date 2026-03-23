import { Queue } from "bullmq";
import { env } from "./env";

export const bullMQConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null as null,
  enableReadyCheck: false,
  tls: env.REDIS_TLS ? {} : undefined,
};

let assignmentQueueInstance: Queue | null = null;

export function getAssignmentQueue(): Queue {
  if (assignmentQueueInstance) return assignmentQueueInstance;

  assignmentQueueInstance = new Queue("assignment-generation", {
    connection: bullMQConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: { count: 50 },
      removeOnFail: { count: 100 },
    },
  });

  return assignmentQueueInstance;
}

export const assignmentQueue = getAssignmentQueue();
