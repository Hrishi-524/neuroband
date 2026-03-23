"use client";

import { useState, useEffect, useRef } from "react";
import { Student, DataPoint } from "@/lib/types";
import { generateStudents } from "@/lib/mockData";
import {
    getFocusScore,
    getDistribution,
    getClassTimeSeries,
    getSmartAlerts,
    getAiInsights,
} from "@/lib/analytics";

export interface SmartAlert {
    message: string;
    severity: "healthy" | "warning" | "critical";
}

export interface AiInsight {
    message: string;
    type: "positive" | "suggestion" | "warning";
}

export interface SimulationState {
    students: Student[];
    focusScore: number;
    prevFocusScore: number;
    distribution: { high: number; medium: number; low: number };
    timeSeries: DataPoint[];
    alerts: SmartAlert[];
    insights: AiInsight[];
    ready: boolean;
}

function tickStudents(students: Student[]): Student[] {
    const now = Date.now();
    return students.map((s) => {
        const delta = Math.random() * 10 - 5;
        const newConcentration = Math.round(
            Math.max(0, Math.min(100, s.concentration + delta))
        );

        const newHistory = [
            ...s.history.slice(1),
            { timestamp: now, value: newConcentration },
        ];

        return {
            ...s,
            concentration: newConcentration,
            history: newHistory,
        };
    });
}

// Empty initial state for SSR (avoids hydration mismatch)
const EMPTY_STATE: SimulationState = {
    students: [],
    focusScore: 0,
    prevFocusScore: 0,
    distribution: { high: 0, medium: 0, low: 0 },
    timeSeries: [],
    alerts: [{ message: "Initializing...", severity: "healthy" }],
    insights: [{ message: "Starting up classroom monitoring...", type: "positive" }],
    ready: false,
};

export function useSimulation(studentCount = 25): SimulationState {
    const [students, setStudents] = useState<Student[]>([]);
    const [mounted, setMounted] = useState(false);
    const prevScoreRef = useRef<number>(0);

    // Initialize only on client (after mount)
    useEffect(() => {
        setStudents(generateStudents(studentCount));
        setMounted(true);
    }, [studentCount]);

    // Tick every 3 seconds (only after mounted)
    useEffect(() => {
        if (!mounted) return;
        const interval = setInterval(() => {
            setStudents((prev) => tickStudents(prev));
        }, 3000);
        return () => clearInterval(interval);
    }, [mounted]);

    // Before mount, return empty state to match SSR
    if (!mounted || students.length === 0) {
        return EMPTY_STATE;
    }

    const focusScore = getFocusScore(students);
    const distribution = getDistribution(students);
    const timeSeries = getClassTimeSeries(students);
    const alerts = getSmartAlerts(students);
    const insights = getAiInsights(students, focusScore);

    const prevFocusScore = prevScoreRef.current;
    prevScoreRef.current = focusScore;

    return {
        students,
        focusScore,
        prevFocusScore,
        distribution,
        timeSeries,
        alerts,
        insights,
        ready: true,
    };
}
