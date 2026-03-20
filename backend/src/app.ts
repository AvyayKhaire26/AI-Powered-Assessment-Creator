import "./config/env"; // validates env first, before anything else
import express, { Application } from "express";
import cors from "cors";
import { initSocket } from "./websocket/socket";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { logger } from "./utils/logger";
import { initServices } from "./config";
import { env } from "./config/env";
import routes from "./routes";
import "./workers/generation.worker";
import "./workers/pdf.worker";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "./utils/response.util";
import path from "path";

const app: Application = express();
const httpServer = createServer(app);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api/v1", routes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  ApiResponse.internalError(res, err.message);
});

const start = async (): Promise<void> => {
  await initServices();
  initSocket(httpServer);
  httpServer.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});

export { httpServer }; // needed for socket.io
