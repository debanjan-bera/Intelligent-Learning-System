import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { checkRole } from "../middleware/roleMiddleware";
import { generateQuiz, startQuiz, submitQuiz } from "../controllers/quiz.controller";

const quizRoute = Router();

quizRoute.post("/generate", authMiddleware, generateQuiz);
quizRoute.post("/start", authMiddleware, startQuiz);
quizRoute.post("/:attemptId/submit", authMiddleware, submitQuiz);

export default quizRoute;
