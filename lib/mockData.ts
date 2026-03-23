import { Student } from "./types";

const NAMES = [
  "Aarav Mehta", "Vivaan Shah", "Aditya Iyer", "Ishaan Kapoor",
  "Krishna Nair", "Ananya Sharma", "Diya Patel", "Meera Joshi",
  "Riya Gupta", "Sara Khan", "Arjun Reddy", "Kabir Singh",
  "Rohan Das", "Neha Kulkarni", "Sneha Pillai", "Rahul Verma",
  "Pooja Desai", "Kunal Agarwal", "Aditi Rao", "Manav Jain",
  "Siddharth Malhotra", "Tanvi Bansal", "Yash Choudhary", "Nikhil Sinha",
  "Priya Menon", "Dev Patel", "Aryan Gupta", "Ira Bose"
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function randomValue() {
  return Math.floor(40 + Math.random() * 60);
}

function generateHistory(): { timestamp: number; value: number }[] {
  const now = Date.now();
  const points = [];

  let base = randomValue();

  for (let i = 0; i < 20; i++) {
    base += Math.random() * 10 - 5;
    base = Math.max(0, Math.min(100, base));

    points.push({
      timestamp: now - (20 - i) * 60000,
      value: Math.round(base),
    });
  }

  return points;
}

export function generateStudents(count = 20): Student[] {
  const shuffledNames = shuffle(NAMES);

  return Array.from({ length: count }).map((_, i) => {
    const history = generateHistory();

    return {
      id: `s-${i}`,
      name: shuffledNames[i % shuffledNames.length], // no numbering
      concentration: history[history.length - 1].value,
      history,
    };
  });
}