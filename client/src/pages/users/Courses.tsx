import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourseContext } from "@/context/CourseContext";
import type { Difficulty } from "@/data/courses";

const difficultyFilters: ("all" | Difficulty)[] = ["all", "beginner", "intermediate", "advanced"];

export default function Courses() {
    const { courses, loading, error } = useCourseContext();
    const [filter, setFilter] = useState<"all" | Difficulty>("all");

    const filtered = filter === "all" ? courses : courses.filter((c) => c.difficulty === filter);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Catalog</h1>
                    <p className="text-muted-foreground mt-1">Explore and enroll in AI-driven learning paths.</p>
                </div>

                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-center">
                        {error}
                    </div>
                )}

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {difficultyFilters.map((d) => (
                        <button
                            key={d}
                            onClick={() => setFilter(d)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 capitalize ${filter === d
                                ? "bg-primary text-white shadow-sm"
                                : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                }`}
                        >
                            {d === "all" ? "All Courses" : d}
                        </button>
                    ))}
                    <span className="ml-auto text-sm text-muted-foreground self-center">
                        {filtered.length} course{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
