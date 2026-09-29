import { analyzeResume } from "../analyzer/resumeAnalysis.js";
import Allowed from "../models/Allowed.js";

export const analyzeResumeController = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Select all required fields.",
      });
    }

    const result = await analyzeResume(req.user._id, role);

    res.status(200).json({
      success: true,
      role: result.role,
      keywords: result.keywords,
      allKeywords: result.allKeywords,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  }
};

export const getRoles = async (req, res) => {
    try {
        const data = await Allowed.findOne({});
        res.status(200).json({
            roles: data?.roles || []
        });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({
            message: "Failed to fetch roles"
        });
    }
};
