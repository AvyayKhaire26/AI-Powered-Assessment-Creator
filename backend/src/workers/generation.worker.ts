import { Worker, Job } from "bullmq";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { AIService } from "../services/ai.service";
import { AssignmentJobPayload } from "../types";
import { emitPaperReady, emitPaperFailed } from "../websocket/events";
import { bullMQConnection } from "../config/queue";
import { getRedisConnection } from "../config/redis";
import { logger } from "../utils/logger";

const repository = new AssignmentRepository();
const aiService = new AIService();

let generationWorkerInstance: Worker | null = null;

export function getGenerationWorker(): Worker {
  if (generationWorkerInstance) return generationWorkerInstance;

  generationWorkerInstance = new Worker<AssignmentJobPayload>(
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
        await getRedisConnection().del(`assignment:${assignmentId}`);

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
      connection: bullMQConnection,
      concurrency: 1,
      drainDelay: 300,        
      stalledInterval: 300000,
      maxStalledCount: 1,
      lockDuration: 60000,
      lockRenewTime: 30000,
    }
  );

  // Shut down worker when queue is empty to eliminate idle Redis commands
  generationWorkerInstance.on("drained", async () => {
    logger.info("Generation queue drained — closing worker to save Redis commands");
    try {
      await generationWorkerInstance?.close();
    } finally {
      generationWorkerInstance = null;
    }
  });

  generationWorkerInstance.on("completed", (job) =>
    logger.info(`Generation job completed: ${job.id}`)
  );

  generationWorkerInstance.on("failed", (job, err) =>
    logger.error(`Generation job failed: ${job?.id} — ${err.message}`)
  );

  return generationWorkerInstance;
}
