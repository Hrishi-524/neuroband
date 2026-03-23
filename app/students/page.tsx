"use client";

import { useSimulation } from "@/hooks/useSimulation";
import { StudentTable } from "@/components/studnets/StudentTable";
import { Loader2 } from "lucide-react";

export default function StudentsPage() {
  const { students, ready } = useSimulation(25);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Student Monitoring
          </h1>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">Live</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Individual cognitive engagement tracking
        </p>
      </div>

      {!ready ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading student data...</p>
        </div>
      ) : (
        <StudentTable students={students} />
      )}
    </div>
  );
}