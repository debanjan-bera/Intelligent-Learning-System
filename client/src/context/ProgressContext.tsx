import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
    useCallback,
} from "react";
import { type HistoryRecord, type WeeklyPerformance } from "@/data/history";
import { getQuizHistory } from "@/utils/api/quizHistory/quizHistory.api";
import { getOverallProgress, getCourseWiseProgress, getWeeklyPerformance, type IOverallProgress, type ICourseProgress } from "@/utils/api/progress/progress.api";
import useAuth from "@/hooks/useAuth";

interface ProgressContextType {
    history: HistoryRecord[];
    weeklyPerformance: WeeklyPerformance[];
    totalQuizzes: number;
    averageScore: number;
    overallProgress: IOverallProgress | null;
    courseProgress: Record<string, ICourseProgress>;
    overallAccuracy: number;
    isLoading: boolean;
    refreshHistory: () => Promise<void>;
    addResult: (record: HistoryRecord) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [overallProgress, setOverallProgress] = useState<IOverallProgress | null>(null);
    const [courseProgress, setCourseProgress] = useState<Record<string, ICourseProgress>>({});
    const [weeklyPerformance, setWeeklyPerformance] = useState<WeeklyPerformance[]>([]);
    const { isAuthenticated } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [historyData, overallData, coursesData, weeklyData] = await Promise.all([
                getQuizHistory(),
                getOverallProgress(),
                getCourseWiseProgress(),
                getWeeklyPerformance()
            ]);

            // Map history
            const mappedHistory: HistoryRecord[] = historyData.attempts.map((attempt: any) => ({
                id: attempt.attemptId,
                courseId: attempt.courseId,
                courseName: attempt.courseName,
                score: attempt.score,
                totalQuestions: attempt.totalQuestions,
                accuracy: attempt.accuracy,
                date: attempt.date,
                timeTaken: `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s`,
                topics: []
            }));

            setHistory(mappedHistory);
            setOverallProgress(overallData);
            setWeeklyPerformance(weeklyData);

            // Map course progress to a record for easy access
            const progressMap: Record<string, ICourseProgress> = {};
            coursesData.forEach((p: ICourseProgress) => {
                progressMap[p.courseId] = p;
            });
            setCourseProgress(progressMap);
        } catch (error) {
            console.error("Failed to fetch progress data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        } else {
            // Reset state when not authenticated
            setHistory([]);
            setOverallProgress(null);
            setCourseProgress({});
            setWeeklyPerformance([]);
            setIsLoading(false);
        }
    }, [fetchData, isAuthenticated]);

    const totalQuizzes = overallProgress?.totalQuizzes || history.length;
    const averageScore = overallProgress?.overallAverageScore !== undefined
        ? Math.round(overallProgress.overallAverageScore)
        : (history.length ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) : 0);
    const overallAccuracy = overallProgress?.overallAccuracy !== undefined
        ? Math.round(overallProgress.overallAccuracy)
        : (history.length ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length) : 0);
    const addResult = useCallback((record: HistoryRecord) => {
        setHistory((prev) => [record, ...prev]);
        // Ideally we'd also update overallProgress and courseProgress here or refetch
    }, []);

    return (
        <ProgressContext.Provider
            value={{
                history,
                weeklyPerformance,
                totalQuizzes,
                averageScore,
                overallProgress,
                courseProgress,
                isLoading,
                overallAccuracy,
                refreshHistory: fetchData,
                addResult
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgressContext() {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error("useProgressContext must be inside ProgressProvider");
    return ctx;
}
