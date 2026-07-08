interface QuizTimerProps {
    timeLeft: number;
    totalTime: number;
}

export function QuizTimer({ timeLeft, totalTime }: QuizTimerProps) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const percentage = (timeLeft / totalTime) * 100;
    const isWarning = percentage < 25;
    const isDanger = percentage < 10;

    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const color = isDanger ? "#ef4444" : isWarning ? "#f59e0b" : "hsl(25 95% 53%)";

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(214 32% 91%)" strokeWidth="6" />
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke={color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-base font-bold font-mono ${isDanger ? "text-red-500" : isWarning ? "text-amber-500" : "text-foreground"}`}>
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </span>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">Time Left</p>
        </div>
    );
}
