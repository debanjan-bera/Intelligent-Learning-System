import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import {
    weeklyQuizActivity, difficultyDistribution, topTopics, scoreTrend
} from "@/data/admin";

export default function AdminAnalytics() {
    const diffPieData = difficultyDistribution.map((d) => ({
        difficulty: d.difficulty,
        count: d.count,
        percentage: d.percentage,
    }));

    return (
        <AdminLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Quiz Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Platform-wide performance insights and trends.</p>
                </div>

                {/* Charts row 1 */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Average Score Trend</CardTitle>
                            <CardDescription>Daily average quiz score this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnalyticsChart
                                type="area"
                                data={scoreTrend as unknown as Record<string, unknown>[]}
                                xKey="day"
                                yKey="avgScore"
                                colors={["hsl(25 95% 53%)"]}
                                height={220}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Difficulty Distribution</CardTitle>
                            <CardDescription>Quiz attempts by difficulty level</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnalyticsChart
                                type="pie"
                                data={diffPieData as unknown as Record<string, unknown>[]}
                                xKey="difficulty"
                                yKey="count"
                                colors={["#22c55e", "hsl(25 95% 53%)", "#ef4444"]}
                                height={220}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Charts row 2 */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Activity</CardTitle>
                            <CardDescription>Quiz volume by day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnalyticsChart
                                type="bar"
                                data={weeklyQuizActivity as unknown as Record<string, unknown>[]}
                                xKey="day"
                                yKey={["quizzes", "users"]}
                                colors={["hsl(25 95% 53%)", "#94a3b8"]}
                                height={220}
                            />
                        </CardContent>
                    </Card>

                    {/* Most attempted topics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Topics</CardTitle>
                            <CardDescription>Most attempted quiz topics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topTopics.map((t, idx) => (
                                    <div key={t.topic} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="font-medium text-foreground truncate">{t.topic}</span>
                                                <div className="shrink-0 flex items-center gap-2 ml-2">
                                                    <span className="text-xs text-muted-foreground">{t.attempts} attempts</span>
                                                    <span className={`text-xs font-semibold ${t.avgScore >= 75 ? "text-green-600" : "text-primary"}`}>
                                                        {t.avgScore}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-primary rounded-full"
                                                    style={{ width: `${(t.attempts / topTopics[0].attempts) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
