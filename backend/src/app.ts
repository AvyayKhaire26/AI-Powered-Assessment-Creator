import dotenv from "dotenv";
import express from "express";
import { logger } from "./utils/logger";
import { initServices } from "./config";
import { assignmentQueue } from "./config/queue";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

(async () => {
  await initServices();
})();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

(async () => { await assignmentQueue.add("test-job", { msg: "hello" }); })();