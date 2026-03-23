"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

interface FocusPieChartProps {
    distribution: { high: number; medium: number; low: number };
}

const COLORS = {
    high: "#34d399",   // emerald-400
    medium: "#fbbf24", // amber-400
    low: "#fb7185",    // rose-400
};

export function FocusPieChart({ distribution }: FocusPieChartProps) {
    const data = [
        { name: "High Focus", value: distribution.high, color: COLORS.high },
        { name: "Medium Focus", value: distribution.medium, color: COLORS.medium },
        { name: "Low Focus", value: distribution.low, color: COLORS.low },
    ];

    const total = distribution.high + distribution.medium + distribution.low;

    return (
        <Card className="border-0 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <PieIcon className="h-4 w-4 text-cyan-400" />
                    Focus Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-6">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                strokeWidth={0}
                                animationBegin={200}
                                animationDuration={800}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        style={{ filter: "drop-shadow(0 0 8px " + entry.color + "40)" }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(0.16 0.015 250)",
                                    border: "1px solid oklch(1 0 0 / 0.1)",
                                    borderRadius: "12px",
                                    color: "#e2e8f0",
                                    fontSize: "13px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}60` }}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {entry.name}{" "}
                                    <span className="font-semibold text-foreground">
                                        {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Descriptive summary */}
                    <p className="text-[11px] text-muted-foreground/70 text-center leading-relaxed px-4">
                        {total > 0 && (
                            <>
                                <span className="text-emerald-400 font-medium">{Math.round((distribution.high / total) * 100)}%</span> highly focused
                                {" · "}
                                <span className="text-amber-400 font-medium">{Math.round((distribution.medium / total) * 100)}%</span> moderate
                                {" · "}
                                <span className="text-rose-400 font-medium">{Math.round((distribution.low / total) * 100)}%</span> need attention
                            </>
                        )}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
