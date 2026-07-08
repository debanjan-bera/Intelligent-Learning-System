import { Types } from "mongoose";

export interface Iprogress {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    accuracy: number;
    weakTopics: string[];
    strongTopics: string[];
    totalQuizzes: number;
    averageScore: number;
}