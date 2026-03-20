import dotenv from "dotenv";
dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGO_URI: required("MONGO_URI"),
  REDIS_URL: required("REDIS_URL"),
  REDIS_TLS: process.env.REDIS_TLS === "true",
  GEMINI_API_KEY: required("GEMINI_API_KEY"),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  REDIS_CACHE_TTL: parseInt(process.env.REDIS_CACHE_TTL || "3600", 10), // 1 hour default
  AUTH_TOKEN: required("AUTH_TOKEN"),   // static token for now
} as const;
