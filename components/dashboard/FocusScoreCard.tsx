"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FocusScoreCardProps {
    score: number;
    prevScore: number;
}

export function FocusScoreCard({ score, prevScore }: FocusScoreCardProps) {
    const [displayScore, setDisplayScore] = useState(score);
    const animFrameRef = useRef<number>(0);

    // Smooth animated counter that lerps to the target
    useEffect(() => {
        let current = displayScore;
        const target = score;

        function animate() {
            const diff = target - current;
            if (Math.abs(diff) < 0.5) {
                setDisplayScore(target);
                return;
            }
            current += diff * 0.15;
            setDisplayScore(Math.round(current));
            animFrameRef.current = requestAnimationFrame(animate);
        }

        animFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrameRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score]);

    const getColor = (val: number) => {
        if (val > 70) return { ring: "stroke-emerald-400", glow: "glow-green", text: "text-emerald-400", bg: "from-emerald-500/20 to-emerald-500/5" };
        if (val > 40) return { ring: "stroke-amber-400", glow: "glow-yellow", text: "text-amber-400", bg: "from-amber-500/20 to-amber-500/5" };
        return { ring: "stroke-rose-400", glow: "glow-red", text: "text-rose-400", bg: "from-rose-500/20 to-rose-500/5" };
    };

    const getStatusLabel = (val: number) => {
        if (val > 70) return "High Engagement";
        if (val > 40) return "Moderate Engagement";
        return "Low Engagement";
    };

    const colors = getColor(score);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    // Trend
    const change = score - prevScore;
    const showTrend = prevScore > 0 && change !== 0;

    return (
        <Card className={cn(
            "relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-500 hover:scale-[1.02] hover:shadow-xl",
            colors.bg,
            "backdrop-blur-xl"
        )}>
            <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
                {/* Glow background */}
                <div className={cn("absolute inset-0 rounded-2xl opacity-40 transition-all duration-700", colors.glow)} />

                {/* Ring */}
                <div className="relative">
                    <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-muted/30"
                        />
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className={cn(colors.ring, "transition-all duration-700 ease-out")}
                            style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn("text-4xl font-bold tabular-nums tracking-tight transition-colors duration-500", colors.text)}>
                            {displayScore}%
                        </span>
                    </div>
                </div>

                <div className="z-10 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-2">
                        <Activity className={cn("h-4 w-4", colors.text)} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Class Focus Score
                        </h3>
                    </div>

                    {/* Status label */}
                    <p className={cn("text-xs font-medium", colors.text)}>
                        {getStatusLabel(score)}
                    </p>

                    {/* Trend indicator */}
                    {showTrend && (
                        <div className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-300",
                            change > 0
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-rose-500/15 text-rose-400"
                        )}>
                            {change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : (
                                <TrendingDown className="h-3 w-3" />
                            )}
                            {change > 0 ? "+" : ""}{change}%
                        </div>
                    )}

                    {!showTrend && prevScore === 0 && (
                        <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-muted/50 text-muted-foreground">
                            <Minus className="h-3 w-3" />
                            Calibrating...
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
