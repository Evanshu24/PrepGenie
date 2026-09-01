import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    role: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    score: {
        type: Number
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["in-progress", "abandoned", "completed"],
        default: "in-progress"
    }
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;