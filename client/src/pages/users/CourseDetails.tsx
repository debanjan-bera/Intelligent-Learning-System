import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    Circle,
    Clock,
    Play,
    ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCourseContext } from "@/context/CourseContext";
import { useQuizContext } from "@/context/QuizContext";
import type { Course, Topic } from "@/@types/interface/course.interface";

type DifficultyOpt = "easy" | "medium" | "hard";

const difficultyOptions: { value: DifficultyOpt; label: string; color: string }[] = [
    { value: "easy", label: "Easy", color: "border-green-500/50 bg-green-500/10 text-green-500" },
    { value: "medium", label: "Medium", color: "border-amber-500/50 bg-amber-500/10 text-amber-500" },
    { value: "hard", label: "Hard", color: "border-red-500/50 bg-red-500/10 text-red-500" },
];

export default function CourseDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCourseById, fetchTopicsByCourseId } = useCourseContext();
    const { startQuiz } = useQuizContext();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [startingQuiz, setStartingQuiz] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyOpt>("easy");
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            const courseData = await getCourseById(id);
            if (courseData) {
                setCourse(courseData);
                const topicsData = await fetchTopicsByCourseId(id);
                setTopics(topicsData);
                if (topicsData.length > 0) {
                    setSelectedTopic(topicsData[0]);
                }
            }
            setLoading(false);
        };
        loadData();
    }, [id, getCourseById, fetchTopicsByCourseId]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!course) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <p className="text-muted-foreground">Course not found.</p>
                    <Link to="/courses" className="text-primary mt-2 inline-block hover:underline">← Back to courses</Link>
                </div>
            </DashboardLayout>
        );
    }

    const imageColor = course.imageColor ?? "from-orange-400 to-orange-600";
    const estimatedTime = course.estimatedTime ?? "2 hours";
    const progress = course.progress ?? 0;
    const isEnrolled = course.enrolled ?? false;
    
    const handleStartQuiz = async () => {
        if (!course || !selectedTopic) {
            alert("Please select a topic first.");
            return;
        }
        
        setStartingQuiz(true);
        const started = await startQuiz(course._id, selectedTopic._id, selectedTopic.name, selectedDifficulty);
        setStartingQuiz(false);
        
        if (started) {
            navigate(`/quiz/${course._id}`);
        } else {
            alert("Failed to generate quiz. Please try again.");
        }
    };

    const completedTopics = topics.filter((t: any) => t.completed).length;

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Breadcrumb */}
                <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                </Link>

                {/* Header card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${imageColor}`} />
                    <div className="p-6">
                        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                            <Badge difficulty={course.difficulty}>{course.difficulty}</Badge>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {topics.length} Modules</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {estimatedTime}</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">{course.title}</h1>
                        <p className="text-muted-foreground">{course.description}</p>

                        {isEnrolled && (
                            <div className="mt-4">
                                <ProgressBar value={progress} showLabel height="h-2" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Topics */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Select a Topic ({completedTopics}/{topics.length} complete)
                    </h2>
                    <div className="space-y-2">
                        {topics.map((topic, idx) => {
                            const isSelected = selectedTopic?._id === topic._id;
                            const isCompleted = (topic as any).completed;
                            
                            return (
                                <button
                                    key={topic._id}
                                    onClick={() => setSelectedTopic(topic)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                        isSelected 
                                            ? "bg-primary/10 border-2 border-primary shadow-sm" 
                                            : isCompleted 
                                                ? "bg-green-500/5 border border-green-500/20 hover:bg-green-500/10" 
                                                : "bg-secondary/50 border border-border hover:border-primary/30"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    ) : isSelected ? (
                                        <Play className="w-4 h-4 text-primary shrink-0 fill-primary" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                        isSelected ? "text-primary" : isCompleted ? "text-green-600" : "text-foreground"
                                    }`}>
                                        {idx + 1}. {topic.name}
                                    </span>
                                    {isCompleted && (
                                        <span className="ml-auto text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">Done</span>
                                    )}
                                    {isSelected && !isCompleted && (
                                        <span className="ml-auto text-xs text-primary font-medium animate-pulse">Selected</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Difficulty selector + start quiz */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                    <div>
                        <h2 className="text-base font-semibold text-foreground mb-1">Select Difficulty</h2>
                        <p className="text-xs text-muted-foreground">Choose the challenge level for this quiz session.</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {difficultyOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setSelectedDifficulty(opt.value)}
                                className={`flex-1 min-w-24 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-150 ${selectedDifficulty === opt.value
                                    ? opt.color + " shadow-sm scale-105"
                                    : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleStartQuiz}
                        disabled={startingQuiz || !selectedTopic}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {startingQuiz ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating Quiz...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                Start Quiz for "{selectedTopic?.name}" <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}
