import API from "../api";

export const startQuiz = async (data: {
  courseId: string;
  topicId: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  numberOfQuestions?: number;
}) => {
  const response = await API.post("/quiz/start", data);
  return response.data;
};

export const submitQuiz = async (
  attemptId: string,
  answers: Array<{ questionIndex: number; selectedAnswer: string }>
) => {
  const response = await API.post(`/quiz/${attemptId}/submit`, { answers });
  return response.data;
};
