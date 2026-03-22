import { Worker, Job } from "bullmq";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { emitPdfReady } from "../websocket/events";
import { bullMQConnection } from "../config/queue";

import { logger } from "../utils/logger";

export interface PdfJobPayload {
    assignmentId: string;
}

export const PDF_JOB_NAME = "generate-pdf" as const;

const repository = new AssignmentRepository();

let pdfWorkerInstance: Worker | null = null;

export function getPdfWorker(): Worker {
    if (pdfWorkerInstance) return pdfWorkerInstance;

    pdfWorkerInstance = new Worker<PdfJobPayload>(
        "pdf-generation",
        async (job: Job<PdfJobPayload>) => {
            const { assignmentId } = job.data;
            logger.info(`Inside pdfWorker — assignmentId: ${assignmentId}`);

            try {
                const assignment = await repository.findById(assignmentId);
                if (!assignment || !assignment.result) {
                    throw new Error(`No result found for assignment: ${assignmentId}`);
                }

                const pdfUrl = `/api/v1/assignments/${assignmentId}/pdf`;
                emitPdfReady(assignmentId, pdfUrl);

                logger.info(`End of pdfWorker — assignmentId: ${assignmentId}`);
            } catch (error) {
                logger.error(`Error inside pdfWorker — assignmentId: ${assignmentId}: ${error}`);
                throw error;
            }
        },
        {
            connection: bullMQConnection,
            concurrency: 1,
            stalledInterval: 120000,
            maxStalledCount: 1,
            drainDelay: 30,
            lockDuration: 30000,
        }
    );

    pdfWorkerInstance.on("completed", (job) =>
        logger.info(`PDF job completed: ${job.id}`)
    );
    pdfWorkerInstance.on("failed", (job, err) =>
        logger.error(`PDF job failed: ${job?.id} — ${err.message}`)
    );

    return pdfWorkerInstance;
}
