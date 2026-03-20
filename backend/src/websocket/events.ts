import { getIO } from "./socket";
import { logger } from "../utils/logger";

export function emitPaperReady(assignmentId: string): void {
    logger.info(`Inside emitPaperReady() — assignmentId: ${assignmentId}`);
    getIO().to(assignmentId).emit("paper:ready", { assignmentId });
}

export function emitPaperFailed(assignmentId: string, reason: string): void {
    logger.info(`Inside emitPaperFailed() — assignmentId: ${assignmentId}`);
    getIO().to(assignmentId).emit("paper:failed", { assignmentId, reason });
}

export function emitPdfReady(assignmentId: string, pdfUrl: string): void {
    logger.info(`Inside emitPdfReady() — assignmentId: ${assignmentId}`);
    getIO().to(assignmentId).emit("pdf:ready", { assignmentId, pdfUrl });
}
