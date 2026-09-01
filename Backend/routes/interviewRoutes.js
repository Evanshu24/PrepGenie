import express from "express";
import {Dashboard,createInterview} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard",authMiddleware,Dashboard);
router.post("/createInterview",authMiddleware,createInterview);

export default router;