"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, AlertCircle, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Student, DataPoint } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";

interface MiniStatsProps {
    students: Student[];
    focusScore: number;
    prevFocusScore: number;
    timeSeries: DataPoint[];
}

export function MiniStats({ students, focusScore, prevFocusScore, timeSeries }: MiniStatsProps) {
    const sorted = useMemo(
        () => [...students].sort((a, b) => b.concentration - a.concentration),
        [students]
    );
    const topStudent = sorted[0];
    const bottomStudent = sorted[sorted.length - 1];

    // Stable fake duration derived from focusScore (no Math.random = no hydration mismatch)
    const avgDuration = `${12 + (focusScore % 8)}m`;

    // Engagement trend
    const last5 = timeSeries.slice(-5).map((p) => p.value);
    const trendDiff = last5.length >= 2 ? last5[last5.length - 1] - last5[0] : 0;
    const trendLabel = trendDiff > 3 ? "Rising" : trendDiff < -3 ? "Declining" : "Stable";
    const TrendIcon = trendDiff > 3 ? TrendingUp : trendDiff < -3 ? TrendingDown : Minus;
    const trendColor = trendDiff > 3
        ? "text-emerald-400"
        : trendDiff < -3
            ? "text-rose-400"
            : "text-cyan-400";

    const stats = [
        {
            icon: Trophy,
            iconColor: "text-amber-400",
            iconBg: "bg-amber-500/10",
            label: "Top Student",
            value: topStudent.name,
            sub: `${topStudent.concentration}%`,
            valueColor: "text-foreground",
        },
        {
            icon: AlertCircle,
            iconColor: "text-rose-400",
            iconBg: "bg-rose-500/10",
            label: "Needs Attention",
            value: bottomStudent.name,
            sub: `${bottomStudent.concentration}%`,
            valueColor: "text-foreground",
        },
        {
            icon: Clock,
            iconColor: "text-cyan-400",
            iconBg: "bg-cyan-500/10",
            label: "Avg. Focus Duration",
            value: avgDuration,
            sub: "per session",
            valueColor: "text-cyan-400",
        },
        {
            icon: TrendIcon,
            iconColor: trendColor,
            iconBg: trendDiff > 3 ? "bg-emerald-500/10" : trendDiff < -3 ? "bg-rose-500/10" : "bg-cyan-500/10",
            label: "Engagement Trend",
            value: trendLabel,
            sub: `${trendDiff > 0 ? "+" : ""}${trendDiff}% shift`,
            valueColor: trendColor,
        },
    ];

    return (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card
                    key={stat.label}
                    className="border-0 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                >
                    <CardContent className="flex items-center gap-3 py-3 px-4">
                        <div className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            stat.iconBg
                        )}>
                            <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none mb-1">
                                {stat.label}
                            </p>
                            <p className={cn("text-base font-bold truncate leading-tight", stat.valueColor)}>
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 leading-none mt-0.5">{stat.sub}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
