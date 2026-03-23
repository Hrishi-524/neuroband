"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DataPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FocusLineChartProps {
    timeSeries: DataPoint[];
}

function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getTrendSummary(timeSeries: DataPoint[]) {
    if (timeSeries.length < 5) return { label: "Insufficient data", icon: Minus, color: "text-muted-foreground" };
    const first5Avg = timeSeries.slice(0, 5).reduce((s, p) => s + p.value, 0) / 5;
    const last5Avg = timeSeries.slice(-5).reduce((s, p) => s + p.value, 0) / 5;
    const diff = last5Avg - first5Avg;

    if (diff > 5) return { label: `Upward trend (+${Math.round(diff)}% avg)`, icon: TrendingUp, color: "text-emerald-400" };
    if (diff < -5) return { label: `Declining trend (${Math.round(diff)}% avg)`, icon: TrendingDown, color: "text-rose-400" };
    return { label: "Stable — minimal variation", icon: Minus, color: "text-cyan-400" };
}

export function FocusLineChart({ timeSeries }: FocusLineChartProps) {
    const data = timeSeries.map((p) => ({
        time: formatTime(p.timestamp),
        focus: p.value,
    }));

    const trend = getTrendSummary(timeSeries);
    const TrendIcon = trend.icon;

    return (
        <Card className="border-0 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    Focus Trend Over Time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                                <stop offset="50%" stopColor="#22d3ee" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                            <filter id="lineGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                        <XAxis
                            dataKey="time"
                            stroke="oklch(0.5 0.02 250)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke="oklch(0.5 0.02 250)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v: number) => `${v}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "oklch(0.14 0.015 250)",
                                border: "1px solid oklch(1 0 0 / 0.12)",
                                borderRadius: "10px",
                                color: "#e2e8f0",
                                fontSize: "12px",
                                boxShadow: "0 8px 24px oklch(0 0 0 / 0.4)",
                            }}
                            labelStyle={{ color: "#94a3b8", fontSize: "10px" }}
                            formatter={(value) => [`${value}%`, "Focus"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="focus"
                            stroke="#22d3ee"
                            strokeWidth={3}
                            fill="url(#focusGradient)"
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "#22d3ee",
                                stroke: "#0e7490",
                                strokeWidth: 2,
                            }}
                            isAnimationActive={false}
                            style={{ filter: "url(#lineGlow)" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Trend summary */}
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/20 px-3 py-1.5">
                    <TrendIcon className={cn("h-3.5 w-3.5", trend.color)} />
                    <span className={cn("text-[11px] font-medium", trend.color)}>
                        {trend.label}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
