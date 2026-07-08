import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HistoryTable } from "@/components/history/HistoryTable";
import { useProgressContext } from "@/context/ProgressContext";

export default function History() {
    const { history, totalQuizzes, overallAccuracy, isLoading } = useProgressContext();
    const [search, setSearch] = useState("");

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    const filtered = history.filter((h) =>
        h.courseName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quiz History</h1>
                        <p className="text-muted-foreground mt-1">Review all your past quiz attempts.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-card border border-border rounded-xl px-4 py-2 text-center">
                            <div className="text-xl font-bold text-foreground">{totalQuizzes}</div>
                            <div className="text-xs text-muted-foreground">Total Quizzes</div>
                        </div>
                        <div className="bg-card border border-border rounded-xl px-4 py-2 text-center">
                            <div className="text-xl font-bold text-primary">{overallAccuracy}%</div>
                            <div className="text-xs text-muted-foreground">Average Score</div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-xs">
                    <input
                        type="search"
                        placeholder="Search by course..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-9 px-3 py-1 text-sm rounded-lg border border-input bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* Table */}

                <HistoryTable records={filtered} />
            </div>
        </DashboardLayout>
    );
}
