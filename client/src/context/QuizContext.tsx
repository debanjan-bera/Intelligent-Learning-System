import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import type { QuizQuestion } from "@/data/quizzes";
import { api } from "@/utils/api";

type QuizStatus = "idle" | "active" | "submitted";

interface QuizState {
    courseId: string;
    attemptId?: string;
    difficulty: "easy" | "medium" | "hard";
    questions: QuizQuestion[];
    currentIndex: number;
    answers: Record<string, string>; // questionId -> selectedOptionId
    timeLeft: number;
    totalTime: number;
    status: QuizStatus;
    score: number;
    accuracy?: number;
    totalQuestions?: number;
    results?: Array<{
        question: string;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation: string;
    }>;
}

interface QuizContextType {
    quiz: QuizState | null;
    startQuiz: (courseId: string, topicId: string, topicName: string, difficulty: "easy" | "medium" | "hard") => Promise<boolean>;
    selectAnswer: (questionId: string, optionId: string) => void;
    goToQuestion: (index: number) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    submitQuiz: () => Promise<void>;
    resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
    const [quiz, setQuiz] = useState<QuizState | null>(null);

    // Timer tick
    useEffect(() => {
        if (!quiz || quiz.status !== "active") return;
        if (quiz.timeLeft <= 0) {
            setQuiz((prev) => prev ? { ...prev, status: "submitted" } : null);
            return;
        }
        const interval = setInterval(() => {
            setQuiz((prev) =>
                prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null
            );
        }, 1000);
        return () => clearInterval(interval);
    }, [quiz?.timeLeft, quiz?.status]);

    const startQuiz = useCallback(async (courseId: string, topicId: string, topicName: string, difficulty: "easy" | "medium" | "hard"): Promise<boolean> => {
        try {
            const response = await api.quiz.startQuiz({
                courseId,
                topicId,
                topic: topicName,
                difficulty,
                numberOfQuestions: 5
            });

            if (response.success) {
                const questions = response.questions.map((q: any, index: number) => ({
                    id: index.toString(),
                    question: q.question,
                    options: q.options.map((opt: string) => ({
                        id: opt, // Use text as ID for simplicity since backend expects the text
                        text: opt
                    })),
                    correctOptionId: "", // Not provided by backend initially
                    explanation: "",
                    topic: topicName
                }));

                const total = questions.length * 60; // 60 seconds per question default

                setQuiz({
                    courseId,
                    attemptId: response.attemptId,
                    difficulty,
                    questions,
                    currentIndex: 0,
                    answers: {},
                    timeLeft: total,
                    totalTime: total,
                    status: "active",
                    score: 0,
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to start quiz:", error);
            return false;
        }
    }, []);

    const selectAnswer = useCallback((questionId: string, optionId: string) => {
        setQuiz((prev) =>
            prev
                ? { ...prev, answers: { ...prev.answers, [questionId]: optionId } }
                : null
        );
    }, []);

    const goToQuestion = useCallback((index: number) => {
        setQuiz((prev) =>
            prev ? { ...prev, currentIndex: index } : null
        );
    }, []);

    const nextQuestion = useCallback(() => {
        setQuiz((prev) =>
            prev && prev.currentIndex < prev.questions.length - 1
                ? { ...prev, currentIndex: prev.currentIndex + 1 }
                : prev
        );
    }, []);

    const prevQuestion = useCallback(() => {
        setQuiz((prev) =>
            prev && prev.currentIndex > 0
                ? { ...prev, currentIndex: prev.currentIndex - 1 }
                : prev
        );
    }, []);

    const submitQuiz = useCallback(async () => {
        if (!quiz || !quiz.attemptId) return;

        try {
            const formattedAnswers = Object.entries(quiz.answers).map(([qId, answer]) => ({
                questionIndex: parseInt(qId),
                selectedAnswer: answer
            }));

            const response = await api.quiz.submitQuiz(quiz.attemptId, formattedAnswers);

            if (response.success) {
                setQuiz((prev) => {
                    if (!prev) return null;
                    return { 
                        ...prev, 
                        status: "submitted", 
                        score: response.score,
                        accuracy: response.accuracy,
                        totalQuestions: response.totalQuestions,
                        results: response.results
                    };
                });
            }
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        }
    }, [quiz]);

    const resetQuiz = useCallback(() => {
        setQuiz(null);
    }, []);

    return (
        <QuizContext.Provider
            value={{
                quiz,
                startQuiz,
                selectAnswer,
                goToQuestion,
                nextQuestion,
                prevQuestion,
                submitQuiz,
                resetQuiz,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
}

export function useQuizContext() {
    const ctx = useContext(QuizContext);
    if (!ctx) throw new Error("useQuizContext must be inside QuizProvider");
    return ctx;
}
