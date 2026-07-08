import type { Course } from "./courses";
import { mockCourses } from "./courses";

// ── Admin Users ──────────────────────────────────────────────────
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    avatar: string; // initials
    enrolledCourses: number;
    quizzesCompleted: number;
    averageScore: number;
    joinedDate: string;
    status: "active" | "inactive";
}

export const adminUsers: AdminUser[] = [
    { id: "u1", name: "Alice Johnson", email: "alice@lumina.ai", avatar: "AJ", enrolledCourses: 4, quizzesCompleted: 12, averageScore: 88, joinedDate: "2026-01-05", status: "active" },
    { id: "u2", name: "Bob Smith", email: "bob@lumina.ai", avatar: "BS", enrolledCourses: 2, quizzesCompleted: 5, averageScore: 64, joinedDate: "2026-01-18", status: "active" },
    { id: "u3", name: "Carol White", email: "carol@lumina.ai", avatar: "CW", enrolledCourses: 3, quizzesCompleted: 9, averageScore: 76, joinedDate: "2026-01-22", status: "active" },
    { id: "u4", name: "David Kim", email: "david@lumina.ai", avatar: "DK", enrolledCourses: 6, quizzesCompleted: 21, averageScore: 91, joinedDate: "2026-02-01", status: "active" },
    { id: "u5", name: "Eva Martinez", email: "eva@lumina.ai", avatar: "EM", enrolledCourses: 1, quizzesCompleted: 3, averageScore: 55, joinedDate: "2026-02-10", status: "inactive" },
    { id: "u6", name: "Frank Lee", email: "frank@lumina.ai", avatar: "FL", enrolledCourses: 5, quizzesCompleted: 18, averageScore: 82, joinedDate: "2026-02-14", status: "active" },
    { id: "u7", name: "Grace Chen", email: "grace@lumina.ai", avatar: "GC", enrolledCourses: 3, quizzesCompleted: 7, averageScore: 73, joinedDate: "2026-02-20", status: "active" },
    { id: "u8", name: "Henry Park", email: "henry@lumina.ai", avatar: "HP", enrolledCourses: 2, quizzesCompleted: 4, averageScore: 60, joinedDate: "2026-03-01", status: "inactive" },
    { id: "u9", name: "Iris Tan", email: "iris@lumina.ai", avatar: "IT", enrolledCourses: 4, quizzesCompleted: 14, averageScore: 84, joinedDate: "2026-03-04", status: "active" },
    { id: "u10", name: "Jake Wilson", email: "jake@lumina.ai", avatar: "JW", enrolledCourses: 2, quizzesCompleted: 6, averageScore: 70, joinedDate: "2026-03-07", status: "active" },
];

// ── Activity Logs ────────────────────────────────────────────────
export type ActivityType = "quiz_started" | "quiz_completed" | "course_created" | "course_updated" | "user_joined";

export interface ActivityLog {
    id: string;
    type: ActivityType;
    description: string;
    user?: string;
    course?: string;
    timestamp: string;
    score?: number;
}

export const adminActivity: ActivityLog[] = [
    { id: "a1", type: "quiz_completed", description: "David Kim completed ML-101 quiz", user: "David Kim", course: "Introduction to ML", timestamp: "2026-03-09T17:42:00Z", score: 90 },
    { id: "a2", type: "quiz_started", description: "Alice Johnson started Deep Learning quiz", user: "Alice Johnson", course: "Deep Learning Fundamentals", timestamp: "2026-03-09T17:15:00Z" },
    { id: "a3", type: "user_joined", description: "Jake Wilson joined the platform", user: "Jake Wilson", timestamp: "2026-03-09T16:55:00Z" },
    { id: "a4", type: "course_updated", description: "NLP course was updated with new topics", course: "Natural Language Processing", timestamp: "2026-03-09T15:30:00Z" },
    { id: "a5", type: "quiz_completed", description: "Iris Tan scored 84% on Statistics quiz", user: "Iris Tan", course: "Statistics for Data Science", timestamp: "2026-03-09T14:50:00Z", score: 84 },
    { id: "a6", type: "quiz_completed", description: "Frank Lee completed CV quiz with 82%", user: "Frank Lee", course: "Computer Vision", timestamp: "2026-03-09T13:20:00Z", score: 82 },
    { id: "a7", type: "course_created", description: "Reinforcement Learning course was created", course: "Reinforcement Learning", timestamp: "2026-03-09T12:00:00Z" },
    { id: "a8", type: "quiz_started", description: "Grace Chen started NLP quiz", user: "Grace Chen", course: "Natural Language Processing", timestamp: "2026-03-09T11:35:00Z" },
    { id: "a9", type: "user_joined", description: "Henry Park joined the platform", user: "Henry Park", timestamp: "2026-03-08T21:00:00Z" },
    { id: "a10", type: "quiz_completed", description: "Carol White scored 76% on ML quiz", user: "Carol White", course: "Introduction to ML", timestamp: "2026-03-08T18:20:00Z", score: 76 },
    { id: "a11", type: "course_updated", description: "Computer Vision course updated", course: "Computer Vision", timestamp: "2026-03-08T15:00:00Z" },
    { id: "a12", type: "quiz_started", description: "Bob Smith started Statistics quiz", user: "Bob Smith", course: "Statistics for Data Science", timestamp: "2026-03-08T12:10:00Z" },
];

// ── Analytics ────────────────────────────────────────────────────
export interface WeeklyQuizActivity {
    day: string;
    quizzes: number;
    users: number;
}

export interface CoursePopularity {
    name: string;
    enrolled: number;
    completions: number;
}

export interface DifficultyDistribution {
    difficulty: string;
    count: number;
    percentage: number;
}

export interface TopTopic {
    topic: string;
    attempts: number;
    avgScore: number;
}

export const weeklyQuizActivity: WeeklyQuizActivity[] = [
    { day: "Mon", quizzes: 12, users: 8 },
    { day: "Tue", quizzes: 19, users: 14 },
    { day: "Wed", quizzes: 15, users: 11 },
    { day: "Thu", quizzes: 22, users: 16 },
    { day: "Fri", quizzes: 28, users: 21 },
    { day: "Sat", quizzes: 35, users: 27 },
    { day: "Sun", quizzes: 24, users: 18 },
];

export const coursePopularity: CoursePopularity[] = [
    { name: "Intro to ML", enrolled: 87, completions: 42 },
    { name: "Deep Learning", enrolled: 64, completions: 28 },
    { name: "NLP", enrolled: 45, completions: 19 },
    { name: "Computer Vision", enrolled: 58, completions: 33 },
    { name: "Reinforcement RL", enrolled: 31, completions: 11 },
    { name: "Statistics", enrolled: 72, completions: 51 },
];

export const difficultyDistribution: DifficultyDistribution[] = [
    { difficulty: "Easy", count: 124, percentage: 44 },
    { difficulty: "Medium", count: 98, percentage: 35 },
    { difficulty: "Hard", count: 58, percentage: 21 },
];

export const topTopics: TopTopic[] = [
    { topic: "Supervised Learning", attempts: 312, avgScore: 78 },
    { topic: "Model Evaluation", attempts: 289, avgScore: 71 },
    { topic: "Neural Networks", attempts: 245, avgScore: 65 },
    { topic: "Probability Theory", attempts: 201, avgScore: 82 },
    { topic: "Feature Engineering", attempts: 178, avgScore: 74 },
    { topic: "Image Classification", attempts: 156, avgScore: 69 },
];

export const scoreTrend: { day: string; avgScore: number }[] = [
    { day: "Mon", avgScore: 68 },
    { day: "Tue", avgScore: 72 },
    { day: "Wed", avgScore: 70 },
    { day: "Thu", avgScore: 75 },
    { day: "Fri", avgScore: 79 },
    { day: "Sat", avgScore: 83 },
    { day: "Sun", avgScore: 81 },
];

// Re-export courses for admin use
export { mockCourses };
export type { Course };
