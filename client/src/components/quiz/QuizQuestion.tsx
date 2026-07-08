import type { QuizQuestion } from "@/data/quizzes";

interface QuizQuestionProps {
    question: QuizQuestion;
    questionNumber: number;
    totalQuestions: number;
    selectedOptionId?: string;
    isSubmitted?: boolean;
    onSelect: (optionId: string) => void;
}

const optionLabels = ["A", "B", "C", "D"];

export function QuizQuestionCard({
    question,
    questionNumber,
    totalQuestions,
    selectedOptionId,
    isSubmitted = false,
    onSelect,
}: QuizQuestionProps) {
    return (
        <div className="space-y-6">
            {/* Question header */}
            <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Question {questionNumber} of {totalQuestions}
                </p>
                <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                    {question.question}
                </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {question.options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = isSubmitted && option.id === question.correctOptionId;
                    const isWrong = isSubmitted && isSelected && option.id !== question.correctOptionId;

                    let style =
                        "border border-border bg-card hover:border-primary hover:bg-primary/5 text-foreground";
                    if (isSelected && !isSubmitted) {
                        style = "border-2 border-primary bg-primary/10 text-primary";
                    }
                    if (isCorrect) {
                        style = "border-2 border-green-500 bg-green-500/10 text-green-500";
                    }
                    if (isWrong) {
                        style = "border-2 border-red-500/50 bg-red-500/10 text-red-500";
                    }

                    return (
                        <button
                            key={option.id}
                            onClick={() => !isSubmitted && onSelect(option.id)}
                            disabled={isSubmitted}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-150 ${style} ${isSubmitted ? "cursor-default" : "cursor-pointer"
                                }`}
                        >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isSelected && !isSubmitted ? "bg-primary text-white" :
                                isCorrect ? "bg-green-500 text-white" :
                                    isWrong ? "bg-red-500 text-white" :
                                        "bg-secondary text-muted-foreground"
                                }`}>
                                {optionLabels[idx]}
                            </span>
                            <span className="text-sm font-medium flex-1">{option.text}</span>
                            {isCorrect && <span className="text-green-500 text-xs font-semibold">✓ Correct</span>}
                            {isWrong && <span className="text-red-500 text-xs font-semibold">✗ Wrong</span>}
                        </button>
                    );
                })}
            </div>

            {/* Explanation (after submit) */}
            {isSubmitted && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Explanation</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
            )}
        </div>
    );
}
