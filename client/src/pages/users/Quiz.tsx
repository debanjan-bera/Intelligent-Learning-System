import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QuizQuestionCard } from "@/components/quiz/QuizQuestion";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { useQuizContext } from "@/context/QuizContext";
import { useProgressContext } from "@/context/ProgressContext";
import { useCourseContext } from "@/context/CourseContext";
import type { HistoryRecord } from "@/data/history";

export default function QuizPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { quiz, selectAnswer, goToQuestion, nextQuestion, prevQuestion, submitQuiz, resetQuiz } = useQuizContext();
    const { addResult } = useProgressContext();
    const { courses } = useCourseContext();
    const [submitting, setSubmitting] = useState(false);

    // Redirect if no active quiz
    useEffect(() => {
        if (!quiz || quiz.courseId !== courseId) {
            navigate(`/courses/${courseId}`);
        }
    }, []);

    // When quiz is submitted, save result and redirect
    useEffect(() => {
        if (quiz?.status === "submitted") {
            const course = courses.find(c => c._id === quiz.courseId);
            const record: HistoryRecord = {
                id: `h-${Date.now()}`,
                courseId: quiz.courseId,
                courseName: course?.title ?? "Unknown Course",
                score: quiz.score,
                totalQuestions: quiz.questions.length,
                difficulty: quiz.difficulty,
                date: new Date().toISOString(),
                timeTaken: `${Math.floor((quiz.totalTime - quiz.timeLeft) / 60)}m ${(quiz.totalTime - quiz.timeLeft) % 60}s`,
                topics: [],
            };
            addResult(record);
            navigate("/results");
        }
    }, [quiz?.status]);

    if (!quiz || quiz.status !== "active") {
        return null;
    }

    const currentQ = quiz.questions[quiz.currentIndex];
    const answeredCount = Object.keys(quiz.answers).length;
    const progress = ((quiz.currentIndex + 1) / quiz.questions.length) * 100;

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        await submitQuiz();
        setSubmitting(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Quiz in Progress</h1>
                        <p className="text-xs text-muted-foreground capitalize">{quiz.difficulty} difficulty</p>
                    </div>
                    <button
                        onClick={() => { resetQuiz(); navigate(`/courses/${quiz.courseId}`); }}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        disabled={submitting}
                    >
                        Exit Quiz
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
                    {/* Main quiz area */}
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                        {/* Progress bar */}
                        <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                <span>Question {quiz.currentIndex + 1} of {quiz.questions.length}</span>
                                <span>{answeredCount} answered</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-1.5 bg-primary rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <QuizQuestionCard
                            question={currentQ}
                            questionNumber={quiz.currentIndex + 1}
                            totalQuestions={quiz.questions.length}
                            selectedOptionId={quiz.answers[currentQ.id]}
                            onSelect={(optionId) => selectAnswer(currentQ.id, optionId)}
                        />

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                            <button
                                onClick={prevQuestion}
                                disabled={quiz.currentIndex === 0 || submitting}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>

                            {quiz.currentIndex < quiz.questions.length - 1 ? (
                                <button
                                    onClick={nextQuestion}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-70"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {submitting ? "Submitting..." : "Submit Quiz"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Timer */}
                        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center">
                            <QuizTimer timeLeft={quiz.timeLeft} totalTime={quiz.totalTime} />
                        </div>

                        {/* Question navigator */}
                        <div className="bg-card border border-border rounded-2xl p-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Questions
                            </p>
                            <div className="grid grid-cols-5 gap-1.5">
                                {quiz.questions.map((q, idx) => {
                                    const isAnswered = !!quiz.answers[q.id];
                                    const isCurrent = idx === quiz.currentIndex;
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => !submitting && goToQuestion(idx)}
                                            disabled={submitting}
                                            className={`h-8 w-full rounded-lg text-xs font-semibold transition-colors ${isCurrent
                                                ? "bg-primary text-white"
                                                : isAnswered
                                                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                                                    : "bg-secondary text-muted-foreground hover:bg-primary/10"
                                                } ${submitting ? "cursor-not-allowed" : ""}`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                                    <span className="text-xs text-muted-foreground">Current</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500/20 border border-green-500/30" />
                                    <span className="text-xs text-muted-foreground">Answered</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit early */}
                        {answeredCount === quiz.questions.length && (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-70"
                            >
                                {submitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {submitting ? "Submitting..." : "Submit Now"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
