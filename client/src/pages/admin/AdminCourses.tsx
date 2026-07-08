import { useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CourseTable } from "@/components/admin/CourseTable";
import { useAdminContext } from "@/context/AdminContext";

export default function AdminCourses() {
    const { courses, deleteCourse, loading, error, refreshCourses, fetchTopics } = useAdminContext();

    const handleDelete = async (id: string) => {
        if (confirm("Delete this course? This action cannot be undone.")) {
            await deleteCourse(id);
        }
    };

    // Prefetch topics for all courses to show counts
    useEffect(() => {
        if (courses.length > 0) {
            courses.forEach(course => {
                const courseId = course._id || (course as any).id;
                fetchTopics(courseId);
            });
        }
    }, [courses, fetchTopics]);

    if (loading && courses.length === 0) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Manage all courses on the platform.</p>
                    </div>
                    <button 
                        onClick={() => refreshCourses()}
                        className="text-xs text-primary hover:underline"
                    >
                        Refresh List
                    </button>
                </div>
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}
                <CourseTable courses={courses} onDelete={handleDelete} />
            </div>
        </AdminLayout>
    );
}
