import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import type { Course, Topic } from "@/@types/interface/course.interface";
import { api } from "@/utils/api";
import useAuth from "@/hooks/useAuth";

interface CourseContextType {
    courses: Course[];
    loading: boolean;
    error: string | null;
    fetchAllCourses: () => Promise<void>;
    fetchTopicsByCourseId: (courseId: string) => Promise<Topic[]>;
    getCourseById: (id: string) => Promise<Course | undefined>;
}

const CourseContext = createContext<CourseContextType | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    const fetchAllCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.course.fetchAllCourses();
            setCourses(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTopicsByCourseId = async (courseId: string) => {
        try {
            return await api.course.fetchTopicsByCourseId(courseId);
        } catch (err: any) {
            console.error("Failed to fetch topics:", err);
            return [];
        }
    };

    const getCourseById = async (id: string) => {
        try {
            return await api.course.fetchCourseById(id);
        } catch (err: any) {
            console.error("Failed to fetch course:", err);
            return undefined;
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAllCourses();
        } else {
            setCourses([]);
            setLoading(false);
        }
    }, [fetchAllCourses, isAuthenticated]);

    return (
        <CourseContext.Provider value={{ 
            courses, 
            loading, 
            error, 
            fetchAllCourses, 
            fetchTopicsByCourseId,
            getCourseById 
        }}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourseContext() {
    const ctx = useContext(CourseContext);
    if (!ctx) throw new Error("useCourseContext must be inside CourseProvider");
    return ctx;
}
