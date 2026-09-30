import express from "express";
import {
  analyzeResumeController,
  getRoles,
} from "../controllers/resumeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeResumeController);
router.get("/roles", getRoles);

export default router;
