import QuizHistoryService from "@/service/quizHistory.service";
import { Request, Response } from "express";

class QuizHistoryController {
  static async getUserQuizHistory(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const history = await QuizHistoryService.getUserQuizHistory(req.user.userId);

      return res.status(200).json({
        success: true,
        message: "Quiz history fetched successfully",
        data: history
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      return res.status(500).json({
        success: false,
        message: "Failed to fetch quiz history",
        error: errorMessage
      });
    }
  }

  static async getQuizAttemptById(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { attemptId } = req.params as { attemptId: string };

      if (!attemptId) {
        return res.status(400).json({
          success: false,
          message: "attemptId is required"
        });
      }

      const attempt = await QuizHistoryService.getQuizAttemptById(req.user.userId, attemptId);

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: "Quiz attempt not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Quiz attempt fetched successfully",
        data: attempt
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      return res.status(500).json({
        success: false,
        message: "Failed to fetch quiz attempt",
        error: errorMessage
      });
    }
  }
}

export default QuizHistoryController;