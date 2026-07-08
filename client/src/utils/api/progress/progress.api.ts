import API from "../api";
import type { IYearlyStreak } from "@/@types/interface/progress.interface";

export type { IYearlyStreak };

export interface ICourseProgress {
    courseId: string;
    totalQuizzes: number;
    accuracy: number;
    averageScore: number;
    strongTopics: string[];
    weakTopics: string[];
}

export interface IOverallProgress {
    totalCourses: number;
    totalQuizzes: number;
    overallAccuracy: number;
    overallAverageScore: number;
    strongTopics: string[];
    weakTopics: string[];
}

export const getCourseWiseProgress = async (): Promise<ICourseProgress[]> => {
    const response = await API.get("/progress/courses");
    return response.data.data;
};

export const getOverallProgress = async (): Promise<IOverallProgress> => {
    const response = await API.get("/progress/overall");
    return response.data.data;
};

export const getWeeklyPerformance = async (): Promise<{ day: string; score: number }[]> => {
    const response = await API.get("/progress/weekly");
    return response.data.data;
};

export const getPlatformStats = async (): Promise<any> => {
    const response = await API.get("/progress/admin/stats");
    return response.data.data;
};

export const getProgressByCourse = async (courseId: string): Promise<ICourseProgress> => {
    const response = await API.get(`/progress/course/${courseId}`);
    return response.data.data;
};

export const getYearlyStreak = async (): Promise<IYearlyStreak> => {
    const response = await API.get("/progress/yearly-streak");
    return response.data.data;
};
