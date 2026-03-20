import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ApiResponse {
    static success<T>(res: Response, data: T, statusCode: number = StatusCodes.OK): Response {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    }

    static created<T>(res: Response, data: T): Response {
        return res.status(StatusCodes.CREATED).json({
            success: true,
            data,
        });
    }

    static notFound(res: Response, message: string = "Resource not found"): Response {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message,
        });
    }

    static badRequest(res: Response, message: string): Response {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message,
        });
    }

    static internalError(res: Response, message: string = "Internal server error"): Response {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message,
        });
    }
}
