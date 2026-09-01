import Interview from "../models/Interview.js";

const Dashboard = async (req, res) => {
    try {
        const UserData = await Interview.find({ userId: req.user._id });
        const completedInterviewsData = UserData.filter(interview => interview.status === "completed");
        const averageScore = data => data.reduce((sum, interview) => sum + interview.score, 0) / Math.max(data.length, 1);
        const maxScore = data => data.reduce((maxScore, interview) => Math.max(maxScore, interview.score), 0);
        res.status(200).json({
            success: true,
            message: "API is working fine",
            data: {
                totalInterviews: UserData.length,
                completedInterviews: completedInterviewsData.length,
                averageScore: averageScore(completedInterviewsData),
                bestScore: maxScore(completedInterviewsData),
                interviewList: UserData,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createInterview = async (req, res) => {
    try {
        const { role, difficulty, duration } = req.body;

        if (!role || !difficulty || !duration) {
            return res.status(400).json({
                success: false,
                message: "Select all required fields"
            });
        }

        if (!req.user.resume) {
            return res.status(400).json({
                success: false,
                message: "No resume has been uploaded yet"
            });
        }

        const allowedDifficulties = ["Easy", "Medium", "Hard"];

        if (!allowedDifficulties.includes(difficulty)) {
            return res.status(400).json({
                success: false,
                message: "Invalid difficulty"
            });
        }

        const allowedDurations = [15, 30, 45, 60];

        if (!allowedDurations.includes(Number(duration))) {
            return res.status(400).json({
                success: false,
                message: "Invalid duration"
            });
        }

        const interview = await Interview.create({
            userId: req.user._id,
            role,
            difficulty,
            duration: Number(duration)
        });

        return res.status(201).json({
            success: true,
            message: "Interview document created successfully",
            interviewId: interview._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { Dashboard, createInterview };