import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import QuizHistoryController from "../controllers/quizHistory.controller";

const quizHistoryRoute = Router();

quizHistoryRoute.get("/", authMiddleware, QuizHistoryController.getUserQuizHistory);
quizHistoryRoute.get("/:attemptId", authMiddleware, QuizHistoryController.getQuizAttemptById);

export default quizHistoryRoute;