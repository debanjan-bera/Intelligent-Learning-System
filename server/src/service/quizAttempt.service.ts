import quizAttemptsModel from "@/models/quizAttempts/quizAttempts.model";
import { Ianswer, Iquestion } from "@/types/quizAttempts.types";
import AIService from "./ai.service";

interface CreateAttemptPayload {
  courseId: string;
  topicId: string;
  topic: string;
  difficulty: string;
  numberOfQuestions?: number;
  timeTaken?: number;
}

interface CreateAttemptResult {
  attemptId: string;
  questions: Array<Pick<Iquestion, "question" | "options">>;
}

interface SubmitAnswerInput {
  questionIndex: number;
  selectedAnswer: string;
}

interface SubmitAttemptResult {
  score: number;
  totalQuestions: number;
  accuracy: number;
  courseId: string;
  topic: string;
  result: Ianswer[];
}

class QuizAttemptService {
  static async createAttempt(
    userId: string,
    data: CreateAttemptPayload
  ): Promise<CreateAttemptResult> {
    const { courseId, topicId, topic, difficulty, numberOfQuestions, timeTaken } = data;

    const aiResponse = await AIService.generateQuizQuestions(
      topic,
      difficulty,
      numberOfQuestions || 5
    );

    const cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleanedResponse) as Iquestion[];

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI did not return valid quiz questions");
    }

    const attempt = await quizAttemptsModel.create({
      userId,
      courseId,
      topicId,
      questions,
      answers: [],
      timeTaken: timeTaken ?? 0,
      difficulty: difficulty as "easy" | "medium" | "hard",
      score: 0
    });

    if (!attempt) {
      throw new Error("Failed to create quiz attempt");
    }

    const safeQuestions = questions.map((question) => ({
      question: question.question,
      options: question.options
    }));

    return {
      attemptId: attempt._id.toString(),
      questions: safeQuestions
    };
  }

  static async submitAttempt(
    attemptId: string,
    answers: SubmitAnswerInput[]
  ): Promise<SubmitAttemptResult> {

    const attempt = await quizAttemptsModel.findById(attemptId);

    if (!attempt) {
      throw new Error("Quiz attempt not found");
    }

    let score = 0;

    const evaluatedAnswers: Ianswer[] = answers.map((answer) => {
      const question = attempt.questions[answer.questionIndex];

      if (!question) {
        throw new Error(`Invalid question index: ${answer.questionIndex}`);
      }

      const correctAnswer = question.correctAnswer;

      const isCorrect = answer.selectedAnswer === correctAnswer;

      if (isCorrect) score++;

      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        correctAnswer,
        explanation: question.explanation,
        question: question.question
      };
    });

    attempt.answers = evaluatedAnswers;
    attempt.score = score;

    await attempt.save();

    const totalQuestions = attempt.questions.length;
    const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    return {
      score,
      totalQuestions,
      accuracy,
      courseId: attempt.courseId.toString(),
      topic: attempt.topicId.toString(),
      result: evaluatedAnswers
    };
  }
}

export default  QuizAttemptService;