import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { useAdminContext } from "@/context/AdminContext";
import type { ActivityType } from "@/data/admin";

const filterOptions: { label: string; value: "all" | ActivityType }[] = [
    { label: "All", value: "all" },
    { label: "Quiz Started", value: "quiz_started" },
    { label: "Quiz Completed", value: "quiz_completed" },
    { label: "Course Created", value: "course_created" },
    { label: "Course Updated", value: "course_updated" },
    { label: "User Joined", value: "user_joined" },
];

export default function AdminActivity() {
    const { activity } = useAdminContext();
    const [filter, setFilter] = useState<"all" | ActivityType>("all");

    const filtered = filter === "all" ? activity : activity.filter((a) => a.type === filter);

    return (
        <AdminLayout>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">All recent platform events and actions.</p>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {filterOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === opt.value
                                ? "bg-primary text-white shadow-sm"
                                : "bg-card border border-border text-muted-foreground hover:bg-secondary"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground self-center">
                        {filtered.length} events
                    </span>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Event Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivityFeed activity={filtered} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
