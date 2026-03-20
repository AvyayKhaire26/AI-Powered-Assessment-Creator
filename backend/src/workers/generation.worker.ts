import { Worker, Job } from "bullmq";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { AIService } from "../services/ai.service";
import { AssignmentJobPayload } from "../types";
import { emitPaperReady, emitPaperFailed } from "../websocket/events";
import { sharedConnection } from "../config/queue";
import { logger } from "../utils/logger";
import { redisConnection } from "../config/redis";

const repository = new AssignmentRepository();
const aiService = new AIService();

export const generationWorker = new Worker<AssignmentJobPayload>(
  "assignment-generation",
  async (job: Job<AssignmentJobPayload>) => {
    const { assignmentId } = job.data;
    logger.info(`Inside generationWorker — assignmentId: ${assignmentId}`);

    try {
      const assignment = await repository.findById(assignmentId);
      if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

      await repository.updateStatus(assignmentId, "processing");

      const paper = await aiService.generatePaper(assignment);

      await repository.saveResult(assignmentId, paper);
      await redisConnection.del(`assignment:${assignmentId}`); 
      emitPaperReady(assignmentId);

      logger.info(`End of generationWorker — assignmentId: ${assignmentId}`);
    } catch (error) {
      logger.error(`Error inside generationWorker — assignmentId: ${assignmentId}: ${error}`);
      await repository.updateStatus(assignmentId, "failed");
      emitPaperFailed(assignmentId, String(error));
      throw error;
    }
  },
  {
    connection: sharedConnection,
    concurrency: 1,             
    stalledInterval: 60000,      
    maxStalledCount: 1,
    drainDelay: 10,              
    lockDuration: 60000,         
  }
);

generationWorker.on("completed", (job) => {
  logger.info(`Generation job completed: ${job.id}`);
});

generationWorker.on("failed", (job, err) => {
  logger.error(`Generation job failed: ${job?.id} — ${err.message}`);
});
