import quizAttemptsModel from "@/models/quizAttempts/quizAttempts.model";
import { Types } from "mongoose";

export interface IQuizHistoryItem {
  attemptId: string;
  courseId: string;
  courseName: string;
  topicId: string;
  topicName: string;
  date: Date;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface IQuizHistoryResponse {
  totalAttempts: number;
  attempts: IQuizHistoryItem[];
}

class QuizHistoryService {
  static async getUserQuizHistory(userId: string): Promise<IQuizHistoryResponse> {
    const userObjectId = new Types.ObjectId(userId);

    const attempts = await quizAttemptsModel
      .find({ userId: userObjectId })
      .populate("courseId", "title")
      .populate("topicId", "name")
      .sort({ date: -1 });

    const mappedAttempts: IQuizHistoryItem[] = attempts.map((attempt: any) => {
      const totalQuestions = attempt.questions.length;
      const accuracy = totalQuestions > 0 ? (attempt.score / totalQuestions) * 100 : 0;

      return {
        attemptId: attempt._id.toString(),
        courseId: attempt.courseId?._id?.toString() || attempt.courseId?.toString(),
        courseName: attempt.courseId?.title || "Unknown Course",
        topicId: attempt.topicId?._id?.toString() || attempt.topicId?.toString(),
        topicName: attempt.topicId?.name || "Unknown Topic",
        date: attempt.date,
        score: attempt.score,
        totalQuestions,
        accuracy,
        timeTaken: attempt.timeTaken,
        difficulty: attempt.difficulty
      };
    });

    return {
      totalAttempts: mappedAttempts.length,
      attempts: mappedAttempts
    };
  }

  static async getQuizAttemptById(
    userId: string,
    attemptId: string
  ): Promise<IQuizHistoryItem | null> {
    const userObjectId = new Types.ObjectId(userId);

    const attempt: any = await quizAttemptsModel.findOne({
      _id: attemptId,
      userId: userObjectId
    })
    .populate("courseId", "title")
    .populate("topicId", "name");

    if (!attempt) {
      return null;
    }

    const totalQuestions = attempt.questions.length;
    const accuracy = totalQuestions > 0 ? (attempt.score / totalQuestions) * 100 : 0;

    return {
      attemptId: attempt._id.toString(),
      courseId: attempt.courseId?._id?.toString() || attempt.courseId?.toString(),
      courseName: attempt.courseId?.title || "Unknown Course",
      topicId: attempt.topicId?._id?.toString() || attempt.topicId?.toString(),
      topicName: attempt.topicId?.name || "Unknown Topic",
      date: attempt.date,
      score: attempt.score,
      totalQuestions,
      accuracy,
      timeTaken: attempt.timeTaken,
      difficulty: attempt.difficulty
    };
  }
}

export default QuizHistoryService;