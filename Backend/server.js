import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import cors from "cors";
import abandonStaleInterviews from "./utils/abandonStaleInterviews.js";

connectDB();

setInterval(abandonStaleInterviews, 60 * 1000);

const app = express();

app.use(
  cors({
    origin: "http://localhost:10000",
  }),
);
// app.use("/uploads", express.static("Uploads"));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.get("/", (req, res) => {res.send("ClankViewer Backend Running");});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
