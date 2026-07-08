import { CheckCircle2, XCircle, Info } from "lucide-react";

interface QuestionResultProps {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    index: number;
}

export function QuestionResult({
    question,
    selectedAnswer,
    correctAnswer,
    isCorrect,
    explanation,
    index
}: QuestionResultProps) {
    return (
        <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
            isCorrect 
                ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40" 
                : "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
        }`}>
            <div className="flex items-start gap-3 mb-4">
                <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Question {index + 1}</span>
                    <h4 className="text-base font-semibold text-foreground mt-0.5">{question}</h4>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 ml-9">
                <div className={`p-4 rounded-xl border ${
                    isCorrect ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                }`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Your Answer</p>
                    <p className={`text-sm font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                        {selectedAnswer}
                    </p>
                </div>

                {!isCorrect && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Correct Answer</p>
                        <p className="text-sm font-medium text-green-700">
                            {correctAnswer}
                        </p>
                    </div>
                )}
            </div>

            {explanation && (
                <div className="mt-4 ml-9 flex gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Explanation</p>
                        <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
                            {explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
