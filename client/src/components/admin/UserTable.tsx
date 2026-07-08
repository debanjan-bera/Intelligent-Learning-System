import { useState } from "react";
import { Search, Eye, TrendingUp, TrendingDown } from "lucide-react";
import type { AdminUser } from "@/@types/interface/user.interface";
import { StudentDetailModal } from "./StudentDetailModal";

interface UserTableProps {
    users: AdminUser[];
}

export function UserTable({ users }: UserTableProps) {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    return (
        <>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
                    <div>
                        <h2 className="font-semibold text-foreground">All Students</h2>
                        <p className="text-xs text-muted-foreground">{filtered.length} of {users.length} students</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-input bg-background text-xs text-muted-foreground">
                            <Search className="w-3 h-3" />
                            <input
                                className="bg-transparent outline-none w-48 placeholder:text-muted-foreground"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-secondary/60 border-b border-border">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Students</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Courses</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quizzes</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Accuracy</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((user) => {
                                const scoreColor = user.averageScore >= 80 ? "text-green-600" : user.averageScore >= 60 ? "text-primary" : "text-red-500";
                                const isGood = user.averageScore >= 70;
                                return (
                                    <tr key={user._id || user.id} className="hover:bg-secondary/40 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 shrink-0">
                                                    {user.avatar || user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3 text-muted-foreground">{user.enrolledCourses ?? 0}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{user.quizzesCompleted ?? 0}</td>

                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {!user.quizzesCompleted ? 0 : (
                                                    <>
                                                        <span className={`font-semibold ${scoreColor}`}>{Math.round(user.averageScore ?? 0)}%</span>
                                                        {isGood ? (
                                                            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                                        ) : (
                                                            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                                                        )}
                                                    </>)}


                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">
                                            {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-1.5 rounded-lg border border-border hover:bg-primary/10 hover:border-primary/30 group transition-all"
                                                title="View details"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <StudentDetailModal
                student={selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </>
    );
}
