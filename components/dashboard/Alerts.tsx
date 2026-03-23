"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertTriangle,
    ShieldCheck,
    ShieldAlert,
    Users,
    Clock,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Student } from "@/lib/types";

export interface SmartAlert {
    message: string;
    severity: "healthy" | "warning" | "critical";
}

interface AlertsProps {
    alerts: SmartAlert[];
    students: Student[];
    distribution: { high: number; medium: number; low: number };
}

const SEVERITY_STYLES = {
    healthy: {
        bg: "bg-emerald-500/10 border-emerald-500/20",
        text: "text-emerald-300",
        icon: ShieldCheck,
        iconClass: "text-emerald-400",
        headerBg: "bg-emerald-500/8",
        headerText: "text-emerald-400",
        label: "System Healthy",
    },
    warning: {
        bg: "bg-amber-500/10 border-amber-500/20",
        text: "text-amber-200/90",
        icon: AlertTriangle,
        iconClass: "text-amber-400",
        headerBg: "bg-amber-500/8",
        headerText: "text-amber-400",
        label: "Attention Required",
    },
    critical: {
        bg: "bg-rose-500/10 border-rose-500/20",
        text: "text-rose-200/90",
        icon: ShieldAlert,
        iconClass: "text-rose-400",
        headerBg: "bg-rose-500/8",
        headerText: "text-rose-400",
        label: "Critical Alert",
    },
};

export function Alerts({ alerts, students, distribution }: AlertsProps) {
    const overallSeverity = alerts.some((a) => a.severity === "critical")
        ? "critical"
        : alerts.some((a) => a.severity === "warning")
            ? "warning"
            : "healthy";

    const style = SEVERITY_STYLES[overallSeverity];

    const total = distribution.high + distribution.medium + distribution.low;
    const focusedPct = total > 0 ? Math.round((distribution.high / total) * 100) : 0;
    const distractedCount = distribution.low;
    const lastDropText =
        overallSeverity === "healthy" ? "None" : `~${(distractedCount % 4) + 1}m`;

    return (
        <Card className="border-0 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    System Status
                    <span
                        className={cn(
                            "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                            style.headerBg,
                            style.headerText
                        )}
                    >
                        {style.label}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Compact stat chips */}
                <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                        <Eye className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="text-base font-bold tabular-nums text-foreground">{focusedPct}%</span>
                        <span className="text-[10px] text-muted-foreground">focused</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                        <Users className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        <span className="text-base font-bold tabular-nums text-foreground">{distractedCount}</span>
                        <span className="text-[10px] text-muted-foreground">distracted</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                        <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="text-sm font-bold text-foreground">{lastDropText}</span>
                        <span className="text-[10px] text-muted-foreground">last drop</span>
                    </div>
                </div>

                {/* Alert messages */}
                {alerts.map((alert, i) => {
                    const alertStyle = SEVERITY_STYLES[alert.severity];
                    const AlertIcon = alertStyle.icon;
                    return (
                        <div
                            key={`${alert.severity}-${i}`}
                            className={cn(
                                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all duration-500",
                                alertStyle.bg,
                                alert.severity === "critical" && "animate-pulse-subtle"
                            )}
                        >
                            <AlertIcon className={cn("h-4 w-4 shrink-0", alertStyle.iconClass)} />
                            <p className={cn("text-xs", alertStyle.text)}>
                                {alert.message}
                            </p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
