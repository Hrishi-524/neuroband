export type ConcentrationLevel = "HIGH" | "MEDIUM" | "LOW";

export interface DataPoint {
  timestamp: number;
  value: number; // 0–100
}

export interface Student {
  id: string;
  name: string;
  concentration: number; // current
  history: DataPoint[];
}