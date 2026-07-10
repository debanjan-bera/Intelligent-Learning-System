import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db";
import authRoute from "./api/routes/auth.route";
import courseRoute from "./api/routes/course.route";
import quizRoute from "./api/routes/quiz.route";
import quizHistoryRoute from "./api/routes/quizHistory.route";
import topicRoute from "./api/routes/topic.route";
import userRoute from "./api/routes/user.route";
import cors from "cors"
import progressRoute from "./api/routes/progress.route";
const app = express();
const PORT = process.env.PORT || 5000;


connectDB();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://intelligent-learning-system.vercel.app/",
    process.env.CLIENT_URL as string
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/topics", topicRoute);
app.use("/api/users", userRoute);
app.use("/api/progress", progressRoute)
app.use("/api/quiz-history", quizHistoryRoute)


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});