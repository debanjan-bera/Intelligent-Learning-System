import { useNavigate, Link } from "react-router-dom";
import { RotateCcw, LayoutDashboard, BookOpen, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResultSummary } from "@/components/results/ResultSummary";
import { QuestionResult } from "@/components/results/QuestionResult";
import { useQuizContext } from "@/context/QuizContext";
import { useCourseContext } from "@/context/CourseContext";
import { Badge } from "@/components/ui/badge";

export default function Results() {
    const { quiz, resetQuiz } = useQuizContext();
    const { courses } = useCourseContext();
    const navigate = useNavigate();

    if (!quiz || quiz.status !== "submitted") {
        return (
            <DashboardLayout>
                <div className="text-center py-20 space-y-4">
                    <p className="text-muted-foreground">No quiz result available.</p>
                    <Link to="/" className="text-primary hover:underline">Go to Dashboard</Link>
                </div>
            </DashboardLayout>
        );
    }

    const course = courses.find(c => c._id === quiz.courseId);

    const handleRetry = () => {
        resetQuiz();
        navigate(`/courses/${quiz.courseId}`);
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Quiz Complete</p>
                            <h1 className="text-xl font-bold text-foreground">{course?.title}</h1>
                        </div>
                        <Badge difficulty={quiz.difficulty === "easy" ? "beginner" : quiz.difficulty === "medium" ? "intermediate" : "advanced"}>
                            {quiz.difficulty}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {quiz.totalQuestions ?? quiz.questions.length} questions · {quiz.difficulty} difficulty
                        {quiz.accuracy !== undefined && (
                            <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full font-semibold">
                                {quiz.accuracy}% Accuracy
                            </span>
                        )}
                    </p>
                </div>

                {/* Summary */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <ResultSummary
                        score={quiz.score}
                        totalQuestions={quiz.totalQuestions}
                        accuracy={quiz.accuracy}
                    />
                </div>

                {/* Detailed Results */}
                {quiz.results && quiz.results.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-foreground">Question Review</h2>
                        </div>
                        <div className="space-y-4">
                            {quiz.results.map((result, idx) => (
                                <QuestionResult
                                    key={idx}
                                    index={idx}
                                    question={result.question}
                                    selectedAnswer={result.selectedAnswer}
                                    correctAnswer={result.correctAnswer}
                                    isCorrect={result.isCorrect}
                                    explanation={result.explanation}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-xl font-medium text-sm hover:bg-primary hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" /> Retry Quiz
                    </button>
                    <Link
                        to="/courses"
                        className="flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground rounded-xl font-medium text-sm hover:bg-secondary transition-colors"
                    >
                        <BookOpen className="w-4 h-4" /> Browse Courses
                    </Link>
                    <Link
                        to="/"
                        onClick={resetQuiz}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors ml-auto"
                    >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
