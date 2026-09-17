import Interview from "../models/Interview.js";
import InterviewQuestions from "../models/InterviewQuestions.js";
import fs from "fs/promises";

const Dashboard = async (req, res) => {
    try {
        const UserData = await Interview.find({ userId: req.user._id });
        const completedInterviewsData = UserData.filter(interview => interview.status === "completed");
        const averageScore = data => +(data.reduce((sum, interview) => sum + interview.score, 0) / Math.max(data.length, 1)).toFixed(2);
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

const startInterview = async(req,res)=>{
    try{
        const {role,difficulty,duration,keywords}=req.body;

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
        if (!allowedDifficulties.includes(difficulty)){
            return res.status(400).json({
                success: false,
                message: "Invalid difficulty"
            });
        }

        const allowedDurations = [15, 30, 45, 60];
        if (!allowedDurations.includes(Number(duration))){
            return res.status(400).json({
                success: false,
                message: "Invalid duration"
            });
        }
        const response= await fetch(
            "http://127.0.0.1:8000/interview/start",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: role,
                    keywords: keywords,
                })
            }
        );

        if(!response.ok){
            return res.status(500).json({
                success: false,
                message: "Start Fast API failed here",
            })
        }
        
        const data = await response.json();

        const interviewDocument = await Interview.create({
            userId: req.user._id,
            role : role,
            difficulty : difficulty,
            duration : Number(duration),
            threadId : data.thread_id,
        });

        const interviewQuestions = await InterviewQuestions.create({
            interviewId: interviewDocument._id,
            questionNumber: 1,
            question: data.question.question,
        });
        
        return res.status(201).json({
            success: true,
            threadId: data.thread_id,
            interviewId: interviewDocument._id,
            questionId: interviewQuestions._id,
            question: data.question,
        })


    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

const respondInterview = async(req,res)=>{
    try{
        const {threadId,questionId,interviewId}=req.body;
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Backend did not get the audio file"
            });
        }
        if(!threadId){
            return res.status(400).json({
                success: false,
                message: "Backend did not get the threadId"
            });
        }
        
        if(!questionId){
            return res.status(400).json({
                success: false,
                message: "Backend did not get the questionId"
            });
        }

        if(!interviewId){
            return res.status(400).json({
                success: false,
                message: "Backend did not get the InterviewId"
            });
        }

        const formData = new FormData();
        formData.append("thread_id",threadId);
        const audioBuffer = await fs.readFile(req.file.path);

        formData.append("audio",new Blob([audioBuffer], { type: req.file.mimetype }),req.file.originalname);

        const response = await fetch("http://127.0.0.1:8000/interview/respond",
            {
                method: "POST",
                body: formData
            }
        );
        if(!response.ok){
            return res.status(500).json({
                success: false,
                message: "Please try once again"
            });
        }

        const data = await response.json();
        console.log("FastAPI response:", data);
        const interviewQuestionDoc = await InterviewQuestions.findById(questionId);

        if (!interviewQuestionDoc){
            return res.status(404).json({
                success: false,
                message: "Interview question document not found"
            });
        }
        
        interviewQuestionDoc.userAnswer = data.transcript;
        await interviewQuestionDoc.save();

        const currentQuestionNumber = interviewQuestionDoc.questionNumber;
    
        if(data.status=="ended"){
            const interview = await Interview.findById(interviewId);
            if (!interview) {
                return res.status(404).json({
                        success: false,
                        message: "No interview document with this interviewId found"
                    });
            }
            interview.score = 10*data.evaluation.score;
            interview.status= "completed";
            await interview.save();
            await fs.unlink(req.file.path);
            return res.status(201).json({
                success: true,
                isInterviewEnded: true
            });
        }

        const interviewQuestions = await InterviewQuestions.create({
            interviewId: interviewId,
            questionNumber: currentQuestionNumber + 1,
            question: data.question,
        });

        await fs.unlink(req.file.path);
        return res.status(201).json({
            success: true,
            isInterviewEnded: false,
            interviewId: interviewId,
            questionId: interviewQuestions._id,
            question: data.question
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export { Dashboard, startInterview, respondInterview};