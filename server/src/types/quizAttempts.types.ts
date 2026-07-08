import { Types } from "mongoose";

export interface IquizAttempts {
  userId: Types.ObjectId;

  courseId: Types.ObjectId;
  topicId: Types.ObjectId;

  date: Date;

  questions: Iquestion[];
  answers: Ianswer[];

  timeTaken: number; // in seconds
  difficulty: "easy" | "medium" | "hard";

  score: number;
  createdAt: Date;
}

export interface Iquestion{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export interface Ianswer {
    questionIndex: number;
    selectedAnswer: string;
    isCorrect: boolean;
    question?: string;
    correctAnswer?: string;
    explanation?: string;
}