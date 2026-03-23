import { Student } from "./types";

export interface SmartAlert {
    message: string;
    severity: "healthy" | "warning" | "critical";
}

export interface AiInsight {
    message: string;
    type: "positive" | "suggestion" | "warning";
}

export function getFocusScore(students: Student[]): number {
    const total = students.reduce((sum, s) => sum + s.concentration, 0);
    return Math.round(total / students.length);
}

export function getDistribution(students: Student[]) {
    let high = 0, medium = 0, low = 0;

    students.forEach((s) => {
        if (s.concentration > 70) high++;
        else if (s.concentration > 40) medium++;
        else low++;
    });

    return { high, medium, low };
}

export function getClassTimeSeries(students: Student[]) {
    const length = students[0].history.length;

    const series = [];

    for (let i = 0; i < length; i++) {
        let sum = 0;

        students.forEach((s) => {
            sum += s.history[i].value;
        });

        series.push({
            timestamp: students[0].history[i].timestamp,
            value: Math.round(sum / students.length),
        });
    }

    return series;
}

// Legacy string-based alerts (kept for backwards compat)
export function getAlerts(students: Student[]) {
    const series = getClassTimeSeries(students);

    const last = series[series.length - 1].value;
    const prev = series[series.length - 5]?.value;

    const alerts: string[] = [];

    if (prev && last < prev - 15) {
        alerts.push("⚠️ Focus dropped significantly in last few minutes");
    }

    const lowCount = students.filter(s => s.concentration < 40).length;

    if (lowCount > students.length * 0.4) {
        alerts.push("🚨 Large portion of class is distracted");
    }

    return alerts;
}

// Smart alerts with severity levels
export function getSmartAlerts(students: Student[]): SmartAlert[] {
    const series = getClassTimeSeries(students);
    const alerts: SmartAlert[] = [];

    const last = series[series.length - 1].value;
    const prev3 = series[series.length - 4]?.value;
    const prev5 = series[series.length - 6]?.value;

    const lowCount = students.filter(s => s.concentration < 40).length;
    const lowRatio = lowCount / students.length;

    // Critical: >40% students below 40
    if (lowRatio > 0.4) {
        alerts.push({
            message: `${Math.round(lowRatio * 100)}% of students showing low engagement — immediate attention needed`,
            severity: "critical",
        });
    }

    // Warning: focus dropped >10% recently
    if (prev3 && last < prev3 - 10) {
        const drop = prev3 - last;
        alerts.push({
            message: `Focus dropped ${drop}% in the last few updates — consider a brief activity change`,
            severity: "warning",
        });
    } else if (prev5 && last < prev5 - 10) {
        const drop = prev5 - last;
        alerts.push({
            message: `Gradual decline of ${drop}% detected over time — monitor closely`,
            severity: "warning",
        });
    }

    // Healthy state
    if (alerts.length === 0) {
        alerts.push({
            message: "All clear — classroom engagement is healthy",
            severity: "healthy",
        });
    }

    return alerts;
}

// AI-style insights based on rules
export function getAiInsights(students: Student[], focusScore: number): AiInsight[] {
    const insights: AiInsight[] = [];
    const series = getClassTimeSeries(students);

    const last5 = series.slice(-5).map(p => p.value);
    const isTrendingDown = last5.length >= 3 && last5[last5.length - 1] < last5[0] - 5;
    const isTrendingUp = last5.length >= 3 && last5[last5.length - 1] > last5[0] + 3;
    const isStableHigh = focusScore > 70 && !isTrendingDown;

    const lowCount = students.filter(s => s.concentration < 40).length;

    if (isStableHigh) {
        insights.push({
            message: "Students are well-engaged. Current teaching strategy is effective — keep the momentum going.",
            type: "positive",
        });
    }

    if (isTrendingDown) {
        insights.push({
            message: "Focus is declining steadily. Consider a 2-minute stretch break or switch to an interactive activity.",
            type: "suggestion",
        });
    }

    if (isTrendingUp && !isStableHigh) {
        insights.push({
            message: "Engagement is recovering. Students are responding well to the current approach.",
            type: "positive",
        });
    }

    if (lowCount >= 3) {
        insights.push({
            message: `${lowCount} students need attention. Try a quick poll or group activity to re-engage them.`,
            type: "warning",
        });
    }

    if (focusScore >= 40 && focusScore <= 70 && !isTrendingDown && !isTrendingUp) {
        insights.push({
            message: "Moderate engagement detected. A short knowledge check could boost participation.",
            type: "suggestion",
        });
    }

    // Always return at least one insight
    if (insights.length === 0) {
        insights.push({
            message: "Monitoring classroom patterns. No anomalies detected at this time.",
            type: "positive",
        });
    }

    return insights.slice(0, 2);
}