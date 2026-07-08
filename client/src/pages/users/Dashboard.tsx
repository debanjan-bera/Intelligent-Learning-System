import { Trophy, Target, BrainCircuit, BookOpen, Play, ArrowRight, Clock, History as HistoryIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { YearlyStreakHeatmap } from "@/components/charts/YearlyStreakHeatmap";
import { useProgressContext } from "@/context/ProgressContext";
import { useCourseContext } from "@/context/CourseContext";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { totalQuizzes, averageScore, weeklyPerformance, history, isLoading, overallProgress, courseProgress } = useProgressContext();
  const { courses } = useCourseContext();
  const { user } = useAuth();

  const recentHistory = history.slice(0, 4);
  const enrolledCourses = courses.filter((c: any) => c.enrolled || history.some(h => h.courseId === (c._id || c.id)));
  const recommendedCourses = enrolledCourses.filter((c: any) => {
    const courseId = c._id || c.id || "";
    const progressData = courseProgress[courseId];
    const progress = progressData ? Math.round(progressData.accuracy) : 0;
    return progress < 100;
  }).slice(0, 4);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Good evening! {user?.name}👋</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your learning progress.</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Play className="h-4 w-4 fill-current" /> Continue Learning
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Quizzes Taken"
            value={totalQuizzes}
            // subtitle="All time"
            icon={<BrainCircuit className="h-4 w-4 text-primary" />}
          // trend={{ value: "+3 this week", positive: true }}
          />
          <StatCard
            title="Average Score"
            value={`${averageScore}`}
            icon={<Target className="h-4 w-4 text-amber-500" />}
            iconBg="bg-amber-500/10"
          // trend={{ value: "+4% vs last week", positive: true }}
          />
          <StatCard
            title="Courses Active"
            value={overallProgress?.totalCourses || 0}
            // subtitle="Started learning paths"
            icon={<Trophy className="h-4 w-4 text-yellow-500" />}
            iconBg="bg-yellow-500/10"
          />
          <StatCard
            title="Overall Accuracy"
            value={`${Math.round(overallProgress?.overallAccuracy || 0)}%`}
            // subtitle="Across all attempts"
            icon={<BookOpen className="h-4 w-4 text-green-600" />}
            iconBg="bg-green-600/10"
          />
        </div>

        {/* Chart + Sidebar */}
        <div className="grid gap-4 lg:grid-cols-7">
          {/* Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Your average quiz scores over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart data={weeklyPerformance} />
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Recent Quizzes
                <Link to="/history" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentHistory.length > 0 ? (
                <div className="space-y-3">
                  {recentHistory.map((h) => {
                    const scoreColor =
                      h.accuracy >= 80 ? "text-green-600" : h.accuracy >= 60 ? "text-primary" : "text-red-500";
                    return (
                      <div key={h.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${scoreColor} bg-card border border-border shrink-0`}>
                          {h.accuracy}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{h.courseName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {h.timeTaken} · {h.totalQuestions} Qs
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <HistoryIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">No quizzes yet</p>
                    <p className="text-xs text-muted-foreground">Complete a quiz to see results here.</p>
                  </div>
                  <Link
                    to="/courses"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Yearly Streak Heatmap */}
        <YearlyStreakHeatmap />

        {recommendedCourses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Continue Learning
                <Link to="/courses" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  All Courses <ArrowRight className="w-3 h-3" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedCourses.map((course) => {
                  const courseId = course._id || course.id || "";
                  const progressData = courseProgress[courseId];
                  const progress = progressData ? Math.round(progressData.accuracy) : 0;

                  return (
                    <div key={courseId} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.imageColor || "from-primary to-primary/60"} flex items-center justify-center shrink-0`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate mb-3">{course.title}</p>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-muted-foreground/60">Progress</span>
                            <span className="text-foreground font-extrabold">{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${courseId}`}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        Resume
                      </Link>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}