import { Users, FileText, BookOpen, Award, TrendingUp, BarChart2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminContext } from "@/context/AdminContext";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import useAuth from "@/hooks/useAuth";

export default function AdminDashboard() {
    const { users, courses, totalQuizzesTaken, averagePlatformScore, coursePopularity, loading } = useAdminContext();
    const { user } = useAuth()

    if (loading && courses.length === 0) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        )
    }

    const activeUsers = users.length;

    // Platform overview derived data
    const totalCourses = courses.length || 1;
    const beginnerCount = courses.filter((c) => c.difficulty === "beginner").length;
    const intermediateCount = courses.filter((c) => c.difficulty === "intermediate").length;
    const advancedCount = courses.filter((c) => c.difficulty === "advanced").length;




    const overviewItems = [
        { label: "Courses (Beginner)", count: beginnerCount, max: totalCourses, color: "bg-green-500", suffix: `/${totalCourses}` },
        { label: "Courses (Intermediate)", count: intermediateCount, max: totalCourses, color: "bg-amber-500", suffix: `/${totalCourses}` },
        { label: "Courses (Advanced)", count: advancedCount, max: totalCourses, color: "bg-primary", suffix: `/${totalCourses}` },

    ];

    return (
        <AdminLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Good evening! {user?.name}👋</h1>
                        <p className="text-muted-foreground mt-1">
                            Platform-wide metrics, engagement trends, and recent activity.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-lg border border-border">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span>Live data · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={users.length}
                        subtitle={`${activeUsers} active right now`}
                        icon={<Users className="h-4 w-4 text-primary" />}
                        iconBg="bg-primary/10"
                    />
                    <StatCard
                        title="Quizzes Taken"
                        value={totalQuizzesTaken}
                        subtitle="All-time platform total"
                        icon={<FileText className="h-4 w-4 text-green-600" />}
                        iconBg="bg-green-600/10"
                    />
                    <StatCard
                        title="Active Courses"
                        value={courses.length}
                        subtitle="Published & available"
                        icon={<BookOpen className="h-4 w-4 text-amber-500" />}
                        iconBg="bg-amber-500/10"
                    />
                    <StatCard
                        title="Avg Quiz Score"
                        value={`${averagePlatformScore}%`}
                        subtitle="Across all learners"
                        icon={<Award className="h-4 w-4 text-purple-600" />}
                        iconBg="bg-purple-600/10"
                    />
                </div>



                {/* Platform Overview +Charts Row */}
                <div className="grid items-start gap-4 lg:grid-cols-2">


                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart2 className="w-4 h-4 text-primary" />
                                Platform Overview
                            </CardTitle>
                            <CardDescription>Content distribution and engagement</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {overviewItems.map((item) => (
                                <div key={item.label} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground">{item.label}</span>
                                        <span className="text-foreground">
                                            {item.count}{item.suffix}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.min((item.count / item.max) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>


                    {/* Course Popularity — enrolled vs completions */}
                    <div className="">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Course Popularity</CardTitle>
                                <CardDescription>Enrolled users vs quiz completions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnalyticsChart
                                    type="bar"
                                    data={coursePopularity.slice(0, 5)}
                                    xKey="name"
                                    yKey={["enrolled", "completions"]}
                                    colors={["hsl(25 95% 53%)", "#22c55e"]}
                                    height={240}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
