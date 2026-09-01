import mongoose from "mongoose";

const QuestionsSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },

    questionNumber: {
        type: Number,
        required: true
    },

    question: {
        type: String,
        required: true
    },

    userAnswer: {
        type: String
    },

    aiEvaluation: {
        score: {
            type: Number
        },
        optimalAnswer: {
            type: String
        }
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const InterviewQuestion = mongoose.model("InterviewQuestion",QuestionsSchema);

export default InterviewQuestion;