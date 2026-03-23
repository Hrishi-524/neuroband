"use client";

import { Student } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Brain } from "lucide-react";

interface StudentDetailModalProps {
    student: Student | null;
    open: boolean;
    onClose: () => void;
}

function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getStatusInfo(concentration: number) {
    if (concentration > 70)
        return { label: "Focused", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
    if (concentration > 40)
        return { label: "Moderate", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
    return { label: "Distracted", className: "bg-rose-500/15 text-rose-400 border-rose-500/30" };
}

export function StudentDetailModal({ student, open, onClose }: StudentDetailModalProps) {
    if (!student) return null;

    const status = getStatusInfo(student.concentration);
    const chartData = student.history.map((p) => ({
        time: formatTime(p.timestamp),
        focus: p.value,
    }));

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-lg border-border/50 bg-card/95 backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-lg">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15">
                            <Brain className="h-5 w-5 text-cyan-400" />
                        </div>
                        {student.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-3 pt-1">
                        <span className="text-2xl font-bold tabular-nums text-foreground">
                            {student.concentration}%
                        </span>
                        <Badge variant="outline" className={status.className}>
                            {status.label}
                        </Badge>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 rounded-xl bg-muted/30 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Focus History
                    </p>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                stroke="oklch(0.65 0.02 250)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                stroke="oklch(0.65 0.02 250)"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v: number) => `${v}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(0.16 0.015 250)",
                                    border: "1px solid oklch(1 0 0 / 0.1)",
                                    borderRadius: "10px",
                                    color: "#e2e8f0",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => [`${value}%`, "Focus"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="focus"
                                stroke="#22d3ee"
                                strokeWidth={2}
                                fill="url(#studentGradient)"
                                dot={false}
                                activeDot={{ r: 4, fill: "#22d3ee" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
}
