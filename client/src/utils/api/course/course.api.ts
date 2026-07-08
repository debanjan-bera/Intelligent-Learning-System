import type { Course, CourseResponse, SingleCourseResponse, Topic, TopicResponse, SingleTopicResponse } from "@/@types/interface/course.interface";
import { get, post, put, deleteRequest } from "@/utils/api/apiMethod";

const ROUTE = "courses";
const TOPIC_ROUTE = "topics";

const getToken = () => {
    const token = localStorage.getItem("access_token");
    return token || undefined;
};

// Course API
export const fetchAllCourses = async (): Promise<Course[]> => {
    const res: CourseResponse = await get(`${ROUTE}`, {}, getToken());
    return res.data;
};

export const fetchCourseById = async (courseId: string): Promise<Course> => {
    const res: SingleCourseResponse = await get(`${ROUTE}/${courseId}`, {}, getToken());
    return res.data;
};

export const createCourse = async (course: any): Promise<Course> => {
    const res: SingleCourseResponse = await post(`${ROUTE}`, course, getToken());
    return res.data;
};

export const updateCourse = async (courseId: string, updates: any): Promise<Course> => {
    const res: SingleCourseResponse = await put(`${ROUTE}/${courseId}`, updates, getToken());
    return res.data;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    await deleteRequest(`${ROUTE}/${courseId}`, getToken());
};

// Topic API
export const fetchTopicsByCourseId = async (courseId: string): Promise<Topic[]> => {
    const res: TopicResponse = await get(`${TOPIC_ROUTE}/course/${courseId}`, {}, getToken());
    return res.data;
};

export const fetchTopicById = async (topicId: string): Promise<Topic> => {
    const res: SingleTopicResponse = await get(`${TOPIC_ROUTE}/${topicId}`, {}, getToken());
    return res.data;
};

export const createTopic = async (topic: { name: string; description: string; courseId: string }): Promise<Topic> => {
    const res: SingleTopicResponse = await post(`${TOPIC_ROUTE}`, topic, getToken());
    return res.data;
};

export const updateTopic = async (topicId: string, updates: Partial<Topic>): Promise<Topic> => {
    const res: SingleTopicResponse = await put(`${TOPIC_ROUTE}/${topicId}`, updates, getToken());
    return res.data;
};

export const deleteTopic = async (topicId: string): Promise<void> => {
    await deleteRequest(`${TOPIC_ROUTE}/${topicId}`, getToken());
};