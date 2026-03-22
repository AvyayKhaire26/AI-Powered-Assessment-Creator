import { Request, Response, NextFunction } from "express";
import { IAssignmentService } from "../interfaces/IAssignmentService";
import { getPdfQueue } from "../config/queue";
import { ApiResponse } from "../utils/response.util";
import { logger } from "../utils/logger";

export class AssignmentController {
    constructor(private readonly service: IAssignmentService) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info("Inside AssignmentController create()");
        try {
            const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

            const result = await this.service.createAssignment({
                ...req.body,
                school: req.user!.school,
                fileUrl,
            });

            logger.info("End of AssignmentController create()");
            ApiResponse.created(res, result);
        } catch (error) {
            logger.error(`Error inside AssignmentController create(): ${error}`);
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info("Inside AssignmentController getAll()");
        try {
            const result = await this.service.getAllAssignments();
            logger.info("End of AssignmentController getAll()");
            ApiResponse.success(res, result);
        } catch (error) {
            logger.error(`Error inside AssignmentController getAll(): ${error}`);
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info("Inside AssignmentController getById()");
        try {
            const { id } = req.params as { id: string };
            const assignment = await this.service.getAssignmentById(id);
            if (!assignment) {
                ApiResponse.notFound(res, "Assignment not found");
                return;
            }
            logger.info("End of AssignmentController getById()");
            ApiResponse.success(res, assignment);
        } catch (error) {
            logger.error(`Error inside AssignmentController getById(): ${error}`);
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info("Inside AssignmentController delete()");
        try {
            const { id } = req.params as { id: string };
            await this.service.deleteAssignment(id);
            logger.info("End of AssignmentController delete()");
            ApiResponse.success(res, { message: "Assignment deleted" });
        } catch (error) {
            logger.error(`Error inside AssignmentController delete(): ${error}`);
            next(error);
        }
    }

    async regenerate(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info("Inside AssignmentController regenerate()");
        try {
            const { id } = req.params as { id: string };
            const result = await this.service.regenerateAssignment(id);
            logger.info("End of AssignmentController regenerate()");
            ApiResponse.success(res, result);
        } catch (error) {
            logger.error(`Error inside AssignmentController regenerate(): ${error}`);
            next(error);
        }
    }

    async requestPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info("Inside AssignmentController requestPdf()");
        try {
            const { id } = req.params as { id: string };
            await getPdfQueue().add("generate-pdf", { assignmentId: id });
            logger.info("End of AssignmentController requestPdf()");
            ApiResponse.success(res, { message: "PDF generation started" });
        } catch (error) {
            logger.error(`Error inside AssignmentController requestPdf(): ${error}`);
            next(error);
        }
    }
}
