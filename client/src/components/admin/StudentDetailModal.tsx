import { useState, useEffect } from "react";
import { X, Calendar, BookOpen, Target, BrainCircuit, Clock, ArrowUpRight } from "lucide-react";
import type { AdminUser } from "@/@types/interface/user.interface";
import { useAdminContext } from "@/context/AdminContext";

interface StudentDetailModalProps {
    student: AdminUser | null;
    onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
    const { fetchStudentHistory } = useAdminContext();
    const [history, setHistory] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student) {
            setLoading(true);
            fetchStudentHistory(student._id || student.id!).then((data) => {
                setHistory(data);
                setLoading(false);
            });
        }
    }, [student, fetchStudentHistory]);

    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border border-primary/20 shadow-inner">
                            {student.avatar || student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                            <p className="text-muted-foreground">{student.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Courses</span>
                            </div>
                            <div className="text-xl font-bold text-foreground">{student.enrolledCourses}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <BrainCircuit className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Quizzes</span>
                            </div>
                            <div className="text-xl font-bold text-foreground">{student.quizzesCompleted}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Target className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Accuracy</span>
                            </div>
                            <div className="text-xl font-bold text-foreground">{student.averageScore}%</div>
                        </div>
                    </div>

                    {/* Quiz History */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            Recent Quiz Performance
                        </h3>
                        
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                <p className="text-xs">Loading activity...</p>
                            </div>
                        ) : history?.attempts?.length > 0 ? (
                            <div className="space-y-3">
                                {history.attempts.slice(0, 5).map((attempt: any) => (
                                    <div key={attempt.attemptId} className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold group-hover:text-primary transition-colors">{attempt.courseName}</span>
                                            <span className={`text-sm font-bold ${attempt.accuracy >= 80 ? "text-green-600" : attempt.accuracy >= 60 ? "text-primary" : "text-red-500"}`}>
                                                {Math.round(attempt.accuracy)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(attempt.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                                            </div>
                                            <div className="ml-auto flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                Details <ArrowUpRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-border bg-secondary/20">
                                <p className="text-muted-foreground text-sm">No quiz attempts yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-secondary/10 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
