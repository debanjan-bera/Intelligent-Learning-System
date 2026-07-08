import { Link } from "react-router-dom";
import { Eye, Trash2, Plus } from "lucide-react";
import type { Course } from "@/@types/interface/course.interface";
import { Badge } from "@/components/ui/badge";
import { useAdminContext } from "@/context/AdminContext";

interface CourseTableProps {
    courses: Course[];
    onDelete: (id: string) => void;
}

export function CourseTable({ courses, onDelete }: CourseTableProps) {
    const { getTopicsByCourseId } = useAdminContext();

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                    <h2 className="font-semibold text-foreground">All Courses</h2>
                    <p className="text-xs text-muted-foreground">{courses.length} courses total</p>
                </div>
                <Link
                    to="/admin/courses/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Course
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-secondary/60 border-b border-border">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topics</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {courses.map((course) => {
                            const courseId = course._id || (course as any).id;
                            const topicsCount = getTopicsByCourseId(courseId).length;

                            return (
                                <tr key={courseId} className="hover:bg-secondary/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium text-foreground">{course.title}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge difficulty={course.difficulty}>{course.difficulty}</Badge>
                                    </td>
                                    <td className="px-5 py-4 text-muted-foreground">{topicsCount} topics</td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/courses/${courseId}`}
                                                className="p-1.5 rounded-lg border border-border hover:bg-secondary hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                                            >
                                                <Eye className="w-3.5 h-3.5 " />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(courseId)}
                                                className="p-1.5 rounded-lg border border-border hover:bg-secondary hover:border-red-600 transition-colors text-muted-foreground hover:text-red-500"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 " />
                                            </button>
                                        </div>

                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
