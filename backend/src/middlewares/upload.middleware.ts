import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { logger } from "../utils/logger";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// ensure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed = ["image/jpeg", "image/png"];

  if (allowed.includes(file.mimetype)) {
    logger.info(`File accepted: ${file.originalname}`);
    cb(null, true);
  } else {
    logger.warn(`File rejected — invalid type: ${file.mimetype}`);
    cb(new Error("Only JPEG and PNG files are allowed"));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB — as per Figma
  },
}).single("file"); // field name must be "file" from frontend
