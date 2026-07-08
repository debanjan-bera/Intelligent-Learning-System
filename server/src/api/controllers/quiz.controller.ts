import AIService from "@/service/ai.service";
import QuizAttemptService from "@/service/quizAttempt.service";
import ProgressService from "@/service/progress.service";
import { Request, Response } from "express";

export const generateQuiz = async (req: Request, res: Response) => {
  try {

    const { topic, difficulty, numberOfQuestions } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({
        message: "topic and difficulty are required"
      });
    }

    const quiz = await AIService.generateQuizQuestions(
      topic,
      difficulty,
      numberOfQuestions || 5
    );

    const questions = JSON.parse(quiz);

    res.status(200).json({
      success: true,
      questions
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(502).json({
      message: "Quiz generation failed",
      error: errorMessage
    });

  }
};

export const startQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const { courseId, topicId, topic, difficulty, numberOfQuestions } = req.body;

    if (!courseId || !topicId || !topic || !difficulty) {
      return res.status(400).json({
        message: "courseId, topicId, topic and difficulty are required"
      });
    }

    const attempt = await QuizAttemptService.createAttempt(req.user.userId, {
      courseId,
      topicId,
      topic,
      difficulty,
      numberOfQuestions
    });

    res.status(201).json({
      success: true,
      ...attempt
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      message: "Quiz start failed",
      error: errorMessage
    });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const { attemptId } = req.params as { attemptId: string };
    const { answers } = req.body as {
      answers: Array<{ questionIndex: number; selectedAnswer: string }>;
    };

    if (!attemptId) {
      return res.status(400).json({
        message: "attemptId is required"
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "answers array is required"
      });
    }

    const result = await QuizAttemptService.submitAttempt(attemptId, answers);

    await ProgressService.updateProgress(
      req.user!.userId,
      result.courseId,
      result.topic,
      result.score,
      result.totalQuestions
    );
    res.status(200).json({
      success: true,
      score: result.score,
      totalQuestions: result.totalQuestions,
      accuracy: result.accuracy,
      results: result.result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      message: "Quiz submit failed",
      error: errorMessage
    });
  }
};