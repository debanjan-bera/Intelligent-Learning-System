import type { HistoryRecord } from "@/data/history";

interface HistoryTableProps {
    records: HistoryRecord[];
}

export function HistoryTable({ records }: HistoryTableProps) {
    if (records.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No quiz history yet.</p>
                <p className="text-sm mt-1">Complete a quiz to see your results here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-secondary border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accuracy</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Questions</th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>

                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {records.map((record) => {
                        const scoreColor =
                            record.accuracy >= 80
                                ? "text-green-600 font-bold"
                                : record.accuracy >= 60
                                    ? "text-primary font-bold"
                                    : "text-red-500 font-bold";

                        return (
                            <tr key={record.id} className="hover:bg-secondary/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">
                                    {record.courseName}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={scoreColor}>{record.accuracy}%</span>
                                </td>

                                <td className="px-4 py-3 text-muted-foreground">
                                    {record.totalQuestions} Qs
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(record.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
