import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // 🔥 IMPORTANT FIX
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};