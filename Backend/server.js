import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));
// app.use("/uploads", express.static("Uploads"));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/interview",interviewRoutes);

app.get("/", (req, res) => {
    res.send("PrepGenie Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});