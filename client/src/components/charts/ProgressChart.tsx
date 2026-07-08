import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { WeeklyPerformance } from "@/data/history";

interface ProgressChartProps {
    data: WeeklyPerformance[];
}

export function ProgressChart({ data }: ProgressChartProps) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(25 95% 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(25 95% 53%)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        border: "1px solid hsl(214 32% 91%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                    }}
                    formatter={(value) => [`${value ?? 0}%`, "Score"]}
                />
                <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(25 95% 53%)"
                    strokeWidth={2.5}
                    fill="url(#scoreGradient)"
                    dot={{ fill: "hsl(25 95% 53%)", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "hsl(25 95% 53%)" }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
