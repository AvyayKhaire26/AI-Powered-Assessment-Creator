import { Router } from "express";
import assignmentRoutes from "./assignment.routes";

const router = Router();

router.use("/assignments", assignmentRoutes);

export default router;
