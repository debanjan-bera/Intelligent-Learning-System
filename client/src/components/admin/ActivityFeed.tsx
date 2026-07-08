import { Play, CheckCircle, BookOpen, Pencil, UserPlus } from "lucide-react";
import type { ActivityLog, ActivityType } from "@/data/admin";

interface ActivityFeedProps {
    activity: ActivityLog[];
    limit?: number;
}

const typeConfig: Record<ActivityType, { icon: typeof Play; color: string; bg: string }> = {
    quiz_started: { icon: Play, color: "text-primary", bg: "bg-primary/10" },
    quiz_completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    course_created: { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
    course_updated: { icon: Pencil, color: "text-amber-600", bg: "bg-amber-100" },
    user_joined: { icon: UserPlus, color: "text-purple-600", bg: "bg-purple-100" },
};

function timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityFeed({ activity, limit }: ActivityFeedProps) {
    const items = limit ? activity.slice(0, limit) : activity;

    return (
        <div className="space-y-1">
            {items.map((log, idx) => {
                const cfg = typeConfig[log.type];
                const Icon = cfg.icon;
                return (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug">{log.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                {log.score && (
                                    <span className="text-xs font-semibold text-green-600">Score: {log.score}%</span>
                                )}
                                <span className="text-xs text-muted-foreground">{timeAgo(log.timestamp)}</span>
                            </div>
                        </div>
                        {/* Timeline dot */}
                        {idx < items.length - 1 && (
                            <div className="absolute left-7 mt-8 w-px h-4 bg-border" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
