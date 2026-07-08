import { CheckCircle, XCircle } from "lucide-react";

interface ResultSummaryProps {
    score: number;
    totalQuestions?: number;
    accuracy?: number;
}

export function ResultSummary({ score, totalQuestions = 0, accuracy = 0 }: ResultSummaryProps) {

    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (accuracy / 100) * circumference;
    const scoreColor = accuracy >= 80 ? "#22c55e" : accuracy >= 60 ? "hsl(25 95% 53%)" : "#ef4444";

    return (
        <div className="space-y-8">
            {/* Score ring + stats */}
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score donut */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative w-36 h-36">
                        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(214 32% 91% / 0.3)" strokeWidth="10" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke={scoreColor} strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-foreground">{accuracy}%</span>
                            <span className="text-xs text-muted-foreground">Score</span>
                        </div>
                    </div>
                    <p className={`text-sm font-semibold ${accuracy >= 80 ? "text-green-500" : accuracy >= 60 ? "text-primary" : "text-red-500"}`}>
                        {accuracy >= 80 ? "🎉 Excellent!" : accuracy >= 60 ? "👍 Good Job!" : "💪 Keep Practicing!"}
                    </p>
                </div>

                {/* Breakdown — dark-mode safe */}
                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                        <CheckCircle className="w-7 h-7 text-green-500 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-green-500">{score}</div>
                        <div className="text-xs text-green-500/80 font-medium">Correct</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                        <XCircle className="w-7 h-7 text-red-500 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-red-500">{totalQuestions - score}</div>
                        <div className="text-xs text-red-500/80 font-medium">Incorrect</div>
                    </div>
                </div>
            </div>


        </div>
    );
}
