import API from "../api";

export interface IQuizHistoryItem {
  attemptId: string;
  courseId: string;
  courseName: string;
  topicId: string;
  topicName: string;
  date: string;
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

export const getQuizHistory = async (): Promise<IQuizHistoryResponse> => {
  const response = await API.get("/quiz-history");
  return response.data.data;
};

export const getQuizAttemptById = async (attemptId: string): Promise<IQuizHistoryItem> => {
  const response = await API.get(`/quiz-history/${attemptId}`);
  return response.data.data;
};
