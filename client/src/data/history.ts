export interface HistoryRecord {
    id: string;
    courseId: string;
    courseName: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    date: string;
    timeTaken: string; // e.g. "4m 32s"
    topics: { name: string; correct: number; total: number }[];
}

export interface WeeklyPerformance {
    day: string;
    score: number;
}



export const mockWeeklyPerformance: WeeklyPerformance[] = [
    { day: "Mon", score: 50 },
    { day: "Tue", score: 62 },
    { day: "Wed", score: 75 },
    { day: "Thu", score: 60 },
    { day: "Fri", score: 87 },
    { day: "Sat", score: 0 },
    { day: "Sun", score: 100 },
];
