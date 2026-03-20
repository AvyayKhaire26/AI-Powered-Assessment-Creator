import { Worker, Job, Queue } from "bullmq";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { emitPdfReady } from "../websocket/events";
import { sharedConnection } from "../config/queue";
import { logger } from "../utils/logger";

export interface PdfJobPayload {
    assignmentId: string;
}

export const PDF_JOB_NAME = "generate-pdf" as const;

export const pdfQueue = new Queue<PdfJobPayload>("pdf-generation", {
    connection: sharedConnection,
    defaultJobOptions: {
        attempts: 2,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: { count: 20 },
        removeOnFail: { count: 50 },
    },
});

const repository = new AssignmentRepository();

export const pdfWorker = new Worker<PdfJobPayload>(
    "pdf-generation",
    async (job: Job<PdfJobPayload>) => {
        const { assignmentId } = job.data;
        logger.info(`Inside pdfWorker — assignmentId: ${assignmentId}`);

        try {
            const assignment = await repository.findById(assignmentId);
            if (!assignment || !assignment.result) {
                throw new Error(`No result found for assignment: ${assignmentId}`);
            }

            // plug real PDF lib here later — OCP compliant
            const pdfUrl = `/api/v1/assignments/${assignmentId}/pdf`;

            emitPdfReady(assignmentId, pdfUrl);

            logger.info(`End of pdfWorker — assignmentId: ${assignmentId}`);
        } catch (error) {
            logger.error(`Error inside pdfWorker — assignmentId: ${assignmentId}: ${error}`);
            throw error;
        }
    },
    {
        connection: sharedConnection,
        concurrency: 1,
        stalledInterval: 60000,
        maxStalledCount: 1,
        drainDelay: 10,
        lockDuration: 30000,
    }
);

pdfWorker.on("completed", (job) => logger.info(`PDF job completed: ${job.id}`));
pdfWorker.on("failed", (job, err) => logger.error(`PDF job failed: ${job?.id} — ${err.message}`));
