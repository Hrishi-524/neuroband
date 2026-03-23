"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Student } from "@/lib/types";

interface LeaderboardProps {
    students: Student[];
}

const RANK_STYLES = [
    { badge: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: "text-amber-400" },
    { badge: "bg-slate-400/20 text-slate-300 border-slate-400/30", icon: "text-slate-300" },
    { badge: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: "text-orange-400" },
];

export function Leaderboard({ students }: LeaderboardProps) {
    const top5 = [...students]
        .sort((a, b) => b.concentration - a.concentration)
        .slice(0, 5);

    return (
        <Card className="border-0 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <Crown className="h-4 w-4 text-amber-400" />
                    Top Students
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {top5.map((student, i) => {
                    const rankStyle = RANK_STYLES[i] || null;
                    const barWidth = student.concentration;
                    const barColor =
                        student.concentration > 70
                            ? "bg-emerald-500/40"
                            : student.concentration > 40
                                ? "bg-amber-500/40"
                                : "bg-rose-500/40";

                    return (
                        <div
                            key={student.id}
                            className="group relative flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-muted/30"
                        >
                            {/* Rank */}
                            <div
                                className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                    i < 3
                                        ? `border ${rankStyle?.badge}`
                                        : "bg-muted/40 text-muted-foreground"
                                )}
                            >
                                {i + 1}
                            </div>

                            {/* Name + bar */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium truncate">{student.name}</span>
                                    <span className="text-xs font-bold tabular-nums text-foreground ml-2">
                                        {student.concentration}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-700", barColor)}
                                        style={{ width: `${barWidth}%` }}
                                    />
                                </div>
                            </div>

                            {/* Medal for top 3 */}
                            {i < 3 && (
                                <Medal
                                    className={cn("h-4 w-4 shrink-0 opacity-60", rankStyle?.icon)}
                                />
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
