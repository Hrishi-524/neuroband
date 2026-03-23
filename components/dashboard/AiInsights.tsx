"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AiInsight {
    message: string;
    type: "positive" | "suggestion" | "warning";
}

interface AiInsightsProps {
    insights: AiInsight[];
}

const TYPE_STYLES = {
    positive: {
        bg: "bg-emerald-500/8 border-emerald-500/15",
        text: "text-emerald-200/90",
        icon: Sparkles,
        iconClass: "text-emerald-400",
    },
    suggestion: {
        bg: "bg-cyan-500/8 border-cyan-500/15",
        text: "text-cyan-200/90",
        icon: Lightbulb,
        iconClass: "text-cyan-400",
    },
    warning: {
        bg: "bg-amber-500/8 border-amber-500/15",
        text: "text-amber-200/90",
        icon: AlertCircle,
        iconClass: "text-amber-400",
    },
};

export function AiInsights({ insights }: AiInsightsProps) {
    return (
        <Card className="border-0 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg relative overflow-hidden">
            {/* Subtle glow accent */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                        <Brain className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    AI Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {insights.map((insight, i) => {
                    const style = TYPE_STYLES[insight.type];
                    const Icon = style.icon;
                    return (
                        <div
                            key={`${insight.type}-${i}`}
                            className={cn(
                                "flex items-start gap-3 rounded-xl border p-4 transition-all duration-500 animate-fade-in-up",
                                style.bg
                            )}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", style.iconClass)} />
                            <p className={cn("text-sm leading-relaxed", style.text)}>
                                {insight.message}
                            </p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
