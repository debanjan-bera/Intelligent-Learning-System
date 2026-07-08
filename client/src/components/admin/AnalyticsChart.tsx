import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

type ChartType = "bar" | "area" | "pie";

interface AnalyticsChartProps {
    type: ChartType;
    data: any[];
    xKey: string;
    yKey: string | string[];
    title?: string;
    colors?: string[];
    height?: number;
}

const defaultColors = ["hsl(25 95% 53%)", "hsl(215 16% 47%)", "#22c55e", "#ef4444"];

const tooltipStyle = {
    contentStyle: {
        backgroundColor: "hsl(0 0% 100%)",
        border: "1px solid hsl(214 32% 91%)",
        borderRadius: "8px",
        fontSize: "12px",
    },
};

export function AnalyticsChart({
    type, data, xKey, yKey, title, colors = defaultColors, height = 220,
}: AnalyticsChartProps) {
    const keys = Array.isArray(yKey) ? yKey : [yKey];

    if (type === "bar") {
        return (
            <div className="w-full min-w-0">
                {title && <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{title}</p>}
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                        <Tooltip {...tooltipStyle} />
                        {keys.map((k, i) => (
                            <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === "area") {
        return (
            <div className="w-full min-w-0">
                {title && <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{title}</p>}
                <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {keys.map((k, i) => (
                                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
                        <Tooltip {...tooltipStyle} />
                        {keys.map((k, i) => (
                            <Area
                                key={k} type="monotone" dataKey={k}
                                stroke={colors[i % colors.length]} strokeWidth={2.5}
                                fill={`url(#grad-${k})`}
                                dot={{ fill: colors[i % colors.length], r: 3 }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === "pie") {
        const pieData = data.map((d) => ({ name: d[xKey] as string, value: d[keys[0]] as number }));
        return (
            <div className="w-full min-w-0">
                {title && <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{title}</p>}
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                            {pieData.map((_, i) => (
                                <Cell key={i} fill={colors[i % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipStyle} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}
