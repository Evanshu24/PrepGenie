import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {uploadResume,getLoggedInUser,updateResume,viewResume} from "../controllers/userController.js";
import {registerUser,loginUser,googleLogin,verifyEmail,resendOTP} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getLoggedInUser);
router.post("/uploadResume", authMiddleware, upload.single("resume"), uploadResume);
router.get("/viewResume", authMiddleware, viewResume);
router.put("/updateResume", authMiddleware, upload.single("resume"), updateResume);
router.post("/auth/google", googleLogin);
router.post("/verify-email",verifyEmail);
router.post("/resendOTP", resendOTP);

export default router;