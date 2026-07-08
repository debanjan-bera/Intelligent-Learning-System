import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Clock, BookOpen, GraduationCap } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { TopicManager } from "@/components/admin/TopicManager";
import { useAdminContext } from "@/context/AdminContext";
import { Badge } from "@/components/ui/badge";

export default function AdminCourseDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCourseById, deleteCourse, loading, courses, getTopicsByCourseId } = useAdminContext();
    const course = id ? getCourseById(id) : undefined;

    const handleDelete = async () => {
        if (id && confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            const success = await deleteCourse(id);
            if (success) {
                navigate("/admin/courses");
            }
        }
    };

    if (loading && courses.length === 0) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!course) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-foreground">Course not found</h2>
                    <p className="text-muted-foreground mt-2 text-sm">The course you are looking for does not exist or has been deleted.</p>
                    <Link to="/admin/courses" className="inline-flex items-center gap-2 mt-6 text-primary hover:underline font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    const imageColor = course.imageColor ?? "from-orange-400 to-orange-600";
    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
                {/* Back Link & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Link
                        to="/admin/courses"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/admin/courses/${id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                        >
                            <Pencil className="w-4 h-4" /> Edit Course
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Course
                        </button>
                    </div>
                </div>

                {/* Course Overview Header */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className={`h-32 bg-gradient-to-br ${imageColor} opacity-90`} />
                    <div className="px-8 pb-8 -mt-12 relative">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${imageColor} border-4 border-card shadow-xl flex items-center justify-center`}>
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{course.title}</h1>
                                    <Badge difficulty={course.difficulty}>{course.difficulty}</Badge>
                                </div>
                                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                    {course.description}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Topics</span>
                                <span className="text-xl font-bold text-foreground">{getTopicsByCourseId(id!)?.length ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics Section */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <TopicManager courseId={id!} />
                        </div>
                    </div>

                    {/* Stats/Info Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-foreground">Course Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BookOpen className="w-4 h-4" />
                                        <span>Visible to users</span>
                                    </div>
                                    <span className="font-medium text-green-500">Active</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>Last Updated</span>
                                    </div>
                                    <span className="font-medium text-foreground">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
