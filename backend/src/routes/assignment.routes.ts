import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";
import { AssignmentService } from "../services/assignment.service";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { handleUpload } from "../middlewares/upload.handler";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateAssignmentSchema } from "../validators/assignment.validator";

const router = Router();

const aiRateLimit = rateLimitMiddleware({
  capacity: 5,
  refillRate: 3,
  windowSecs: 60,
});

// DI wiring
const repository = new AssignmentRepository();
const service = new AssignmentService(repository);
const controller = new AssignmentController(service);

router.get("/:id/pdf", (req, res, next) => controller.requestPdf(req, res, next));

router.use(authMiddleware);

router.post("/", aiRateLimit, handleUpload, validate(CreateAssignmentSchema), (req, res, next) => controller.create(req, res, next));
router.get("/", (req, res, next) => controller.getAll(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.delete("/:id", (req, res, next) => controller.delete(req, res, next));
router.post("/:id/regenerate", aiRateLimit, (req, res, next) => controller.regenerate(req, res, next));

export default router;
