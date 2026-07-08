export interface Course {
    _id: string;
    id?: string; // For backward compatibility with some components
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    topics?: Topic[];
    progress?: number;
    enrolled?: boolean;
    imageColor?: string;
    totalQuestions?: number;
    estimatedTime?: string;
    __v?: number;
}

export interface Topic {
    _id: string;
    name: string;
    description: string;
    courseId: string;
    course: string; // Course name or ID depending on population
    __v: number;
}

export interface CourseResponse {
    message: string;
    success: boolean;
    data: Course[];
}

export interface SingleCourseResponse {
    message: string;
    success: boolean;
    data: Course;
}

export interface TopicResponse {
    message: string;
    success: boolean;
    data: Topic[];
}

export interface SingleTopicResponse {
    message: string;
    success: boolean;
    data: Topic;
}