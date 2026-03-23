"use client";

import { useSimulation } from "@/hooks/useSimulation";
import { FocusScoreCard } from "@/components/dashboard/FocusScoreCard";
import { Alerts } from "@/components/dashboard/Alerts";
import { FocusPieChart } from "@/components/dashboard/FocusPieChart";
import { FocusLineChart } from "@/components/dashboard/FocusLineChart";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { MiniStats } from "@/components/dashboard/MiniStats";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { Activity, Loader2 } from "lucide-react";

function getInsightLine(focusScore: number, distribution: { high: number; medium: number; low: number }) {
  const total = distribution.high + distribution.medium + distribution.low;
  const highPct = total > 0 ? Math.round((distribution.high / total) * 100) : 0;

  if (focusScore > 75) return `${highPct}% of students are highly engaged — class performance is excellent.`;
  if (focusScore > 60) return `Most students are attentive, with ${distribution.low} needing support. Overall engagement is healthy.`;
  if (focusScore > 40) return `Moderate engagement detected across the class. Consider switching to an interactive format.`;
  return `Class attention is low — ${distribution.low} students are distracted. Recommend an immediate activity shift.`;
}

export default function DashboardPage() {
  const sim = useSimulation(25);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Classroom Focus Analytics
          </h1>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">Live</span>
          </div>
        </div>
        {/* Dynamic insight line */}
        <div className="mt-2 flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <p className="text-sm text-muted-foreground transition-all duration-500">
            {sim.ready
              ? getInsightLine(sim.focusScore, sim.distribution)
              : "Initializing classroom monitoring system..."}
          </p>
        </div>
      </div>

      {!sim.ready ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading student data...</p>
        </div>
      ) : (
        <>
          {/* Mini Stats Row */}
          <MiniStats
            students={sim.students}
            focusScore={sim.focusScore}
            prevFocusScore={sim.prevFocusScore}
            timeSeries={sim.timeSeries}
          />

          {/* Score + Status Panel Row */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FocusScoreCard score={sim.focusScore} prevScore={sim.prevFocusScore} />
            <div className="md:col-span-1 lg:col-span-2">
              <Alerts alerts={sim.alerts} students={sim.students} distribution={sim.distribution} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <FocusPieChart distribution={sim.distribution} />
            <FocusLineChart timeSeries={sim.timeSeries} />
          </div>

          {/* Bottom Row: AI Insights + Leaderboard */}
          <div className="grid gap-6 md:grid-cols-2">
            <AiInsights insights={sim.insights} />
            <Leaderboard students={sim.students} />
          </div>
        </>
      )}
    </div>
  );
}