import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/@types/interface/course.interface";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { useProgressContext } from "@/context/ProgressContext";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const { courseProgress } = useProgressContext();
    const courseId = course._id || course.id || "";

    // Get real progress from context
    const progressData = courseProgress[courseId];
    const progress = progressData ? Math.round(progressData.accuracy) : 0; // Using accuracy as a proxy for progress for now

    const topicsCount = course.topics?.length ?? 0;
    const imageColor = course.imageColor ?? "from-orange-400 to-orange-600";
    const estimatedTime = course.estimatedTime ?? "2 hours";

    const actionLabel = progress > 0
        ? "Continue Learning"
        : "Start Learning";

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${imageColor}`} />

            <div className="p-5 flex flex-col flex-1 gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${imageColor} bg-opacity-10`}>
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <Badge difficulty={course.difficulty}>{course.difficulty}</Badge>
                </div>

                {/* Title + Description */}
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2 mb-1">
                        {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                    </p>
                </div>

                {/* Topics count */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{topicsCount} Modules</span>
                    <span className="mx-1">·</span>
                    <span>{estimatedTime}</span>
                </div>

                {/* Progress */}
                <div>
                    {progress > 0 ? (
                        <ProgressBar value={progress} showLabel height="h-1.5" />
                    ) : null}
                </div>

                {/* Action */}
                <Link
                    to={`/courses/${courseId}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    {actionLabel} <ChevronRight className="w-4 h-4" />
                </Link>

            </div>
        </div>
    );
}
