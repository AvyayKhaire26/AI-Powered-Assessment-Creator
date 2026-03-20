import { Request, Response, NextFunction } from "express";
import { uploadMiddleware } from "./upload.middleware";
import { ApiResponse } from "../utils/response.util";
import { logger } from "../utils/logger";

export function handleUpload(req: Request, res: Response, next: NextFunction): void {
  logger.info("Inside handleUpload()");

  uploadMiddleware(req, res, (err) => {
    if (err) {
      logger.error(`File upload error: ${err.message}`);
      ApiResponse.badRequest(res, err.message);
      return;
    }
    logger.info("End of handleUpload()");
    next();
  });
}
