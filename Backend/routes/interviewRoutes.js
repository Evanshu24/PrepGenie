import express from "express";
import {Dashboard,startInterview,respondInterview,abandonInterview,questions} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadInterviewAudio from "../middleware/interviewAudioMiddleware.js";

const router = express.Router();

router.get("/dashboard",authMiddleware,Dashboard);
router.post("/startInterview",authMiddleware,startInterview);
router.post("/respondInterview",authMiddleware,uploadInterviewAudio.single("audio"),respondInterview);
router.post("/abandonInterview",authMiddleware,abandonInterview);
router.get("/questions",authMiddleware,questions);


export default router;