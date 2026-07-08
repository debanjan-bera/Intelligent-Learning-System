import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";
import { 
    fetchAllCourses, 
    createCourse, 
    updateCourse as apiUpdateCourse, 
    deleteCourse as apiDeleteCourse, 
    fetchTopicsByCourseId, 
    createTopic, 
    updateTopic as apiUpdateTopic, 
    deleteTopic as apiDeleteTopic 
} from "@/utils/api/course/course.api";
import { fetchAllStudents, fetchStudentHistory } from "@/utils/api/user/user.api";
import { getPlatformStats } from "@/utils/api/progress/progress.api";
import type { Course, Topic } from "@/@types/interface/course.interface";
import type { AdminUser } from "@/@types/interface/user.interface";
import useAuth from "@/hooks/useAuth";
import { adminActivity, type ActivityLog } from "@/data/admin";

interface AdminContextType {
    courses: Course[];
    topics: Topic[];
    loading: boolean;
    error: string | null;
    users: AdminUser[];
    activity: ActivityLog[];
    totalQuizzesTaken: number;
    averagePlatformScore: number;
    coursePopularity: { name: string; enrolled: number; completions: number }[];
    refreshUsers: () => Promise<void>;
    refreshCourses: () => Promise<void>;
    refreshTopics: () => Promise<void>;
    refreshPlatformStats: () => Promise<void>;
    fetchStudentHistory: (userId: string) => Promise<any>;
    addCourse: (course: any) => Promise<Course | null>;
    updateCourse: (id: string, updates: any) => Promise<Course | null>;
    deleteCourse: (id: string) => Promise<boolean>;
    getCourseById: (id: string) => Course | undefined;
    
    // Topic functions
    fetchTopics: (courseId: string) => Promise<Topic[]>;
    addTopic: (topic: { name: string; description: string; courseId: string }) => Promise<Topic | null>;
    updateTopic: (id: string, updates: any) => Promise<Topic | null>;
    deleteTopic: (id: string) => Promise<boolean>;
    getTopicsByCourseId: (courseId: string) => Topic[];
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [platformStats, setPlatformStats] = useState<any>(null);
    const { isAdmin } = useAuth();
    
    const activity = adminActivity;

    const refreshPlatformStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await getPlatformStats();
            setPlatformStats(data);
        } catch (err: any) {
            console.error("Failed to fetch platform stats:", err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const totalQuizzesTaken = platformStats?.totalQuizzes || users.reduce((sum, u) => sum + u.quizzesCompleted, 0);
    const averagePlatformScore = platformStats?.averagePlatformScore !== undefined 
        ? platformStats.averagePlatformScore 
        : Math.round(users.reduce((sum, u) => sum + u.averageScore, 0) / (users.length || 1));
    const coursePopularity = platformStats?.coursePopularity || [];

    const refreshUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllStudents();
            setUsers(data || []);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch students:", err);
            setError(err.message || "Failed to fetch students");
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshCourses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllCourses();
            const mapped = data.map(c => ({ ...c, id: c._id }));
            setCourses(mapped);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshTopics = useCallback(async () => {
        // Implementation for topics if needed
    }, []);

    useEffect(() => {
        if (isAdmin) {
            refreshCourses();
            refreshUsers();
            refreshPlatformStats();
        } else {
            // Reset state when not admin
            setCourses([]);
            setUsers([]);
            setPlatformStats(null);
            setLoading(false);
            setStatsLoading(false);
        }
    }, [refreshCourses, refreshUsers, refreshPlatformStats, isAdmin]);

    const addCourse = useCallback(async (course: any) => {
        try {
            const newCourse: Course = await createCourse(course);
            const mapped: Course = { ...newCourse, id: (newCourse as any)._id || (newCourse as any).id };
            setCourses((prev) => [...prev, mapped]);
            return mapped;
        } catch (err: any) {
            alert(err.message || "Failed to add course");
            return null;
        }
    }, []);

    const updateCourse = useCallback(async (id: string, updates: any) => {
        try {
            const updated = await apiUpdateCourse(id, updates);
            if (!updated) return null;
            const mapped: Course = { ...updated, id: (updated as any)._id || (updated as any).id };
            setCourses((prev) =>
                prev.map((c) => (c._id === id || c.id === id ? mapped : c))
            );
            return mapped;
        } catch (err: any) {
            alert(err.message || "Failed to update course");
            return null;
        }
    }, []);

    const deleteCourse = useCallback(async (id: string) => {
        try {
            await apiDeleteCourse(id);
            setCourses((prev) => prev.filter((c) => c._id !== id && c.id !== id));
            setTopics((prev) => prev.filter(t => t.courseId !== id));
            return true;
        } catch (err: any) {
            alert(err.message || "Failed to delete course");
            return false;
        }
    }, []);

    const getCourseById = useCallback(
        (id: string) => courses.find((c) => c._id === id || c.id === id),
        [courses]
    );

    const fetchTopics = useCallback(async (courseId: string) => {
        try {
            const data = await fetchTopicsByCourseId(courseId);
            setTopics(prev => {
                const other = prev.filter(t => t.courseId !== courseId);
                return [...other, ...data];
            });
            return data;
        } catch (err: any) {
            console.error("Failed to fetch topics:", err);
            return [];
        }
    }, []);

    const addTopic = useCallback(async (topic: { name: string; description: string; courseId: string }) => {
        try {
            const res = await createTopic(topic);
            if (res) {
                setTopics(prev => [...prev, res]);
                setCourses(prev => prev.map(c => {
                    if (c._id === topic.courseId) {
                        return { ...c, topics: [...(c.topics || []), res] };
                    }
                    return c;
                }));
            }
            return res;
        } catch (err: any) {
            console.error("Failed to add topic:", err);
            alert(err.message || "Failed to add topic");
            throw err;
        }
    }, []);

    const updateTopic = useCallback(async (id: string, updates: any) => {
        try {
            const updated = await apiUpdateTopic(id, updates);
            if (updated) {
                setTopics(prev => prev.map(t => t._id === id ? updated : t));
                setCourses(prev => prev.map(c => ({
                    ...c,
                    topics: c.topics?.map(t => t._id === id ? updated : t)
                })));
            }
            return updated;
        } catch (err: any) {
            alert(err.message || "Failed to update topic");
            return null;
        }
    }, []);

    const deleteTopic = useCallback(async (id: string) => {
        try {
            await apiDeleteTopic(id);
            setTopics(prev => prev.filter(t => t._id !== id));
            setCourses(prev => prev.map(c => ({
                ...c,
                topics: c.topics?.filter(t => t._id !== id)
            })));
            return true;
        } catch (err: any) {
            alert(err.message || "Failed to delete topic");
            return false;
        }
    }, []);

    const getTopicsByCourseId = useCallback((courseId: string) => {
        return topics.filter(t => t.courseId === courseId);
    }, [topics]);

    const handleFetchStudentHistory = useCallback(async (userId: string) => {
        try {
            const history = await fetchStudentHistory(userId);
            return history;
        } catch (err: any) {
            console.error("Failed to fetch student history:", err);
            return null;
        }
    }, []);

    return (
        <AdminContext.Provider
            value={{
                courses,
                topics,
                loading: loading || statsLoading,
                error,
                users,
                activity,
                totalQuizzesTaken,
                averagePlatformScore,
                coursePopularity,
                refreshUsers,
                refreshCourses,
                refreshTopics,
                refreshPlatformStats,
                fetchStudentHistory: handleFetchStudentHistory,
                addCourse,
                updateCourse,
                deleteCourse,
                getCourseById,
                fetchTopics,
                addTopic,
                updateTopic,
                deleteTopic,
                getTopicsByCourseId
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdminContext must be inside AdminProvider");
    return ctx;
}
