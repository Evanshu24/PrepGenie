import { analyzeResume } from "../analyzer/resumeAnalysis.js";

export const analyzeResumeController = async (req, res) => {
  try {
    const result = await analyzeResume(req.user._id);

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
