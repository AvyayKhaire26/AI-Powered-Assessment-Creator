import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { AuthUser } from "../types/auth.types";
import { logger } from "../utils/logger";

// hardcoded user — swap this out for JWT decode later, zero other changes needed
const HARDCODED_USER: AuthUser = {
  id: "teacher-001",
  name: "John Doe",
  school: "Delhi Public School, Sector-4, Bokaro",
  role: "teacher",
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  logger.info("Inside authMiddleware()");

  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token || token !== env.AUTH_TOKEN) {
    logger.warn("Unauthorized request — invalid or missing token");
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  req.user = HARDCODED_USER;
  logger.info("End of authMiddleware()");
  next();
}
