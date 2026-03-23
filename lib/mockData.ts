import { Student } from "./types";

const NAMES = [
  "Aarav", "Vivaan", "Aditya", "Ishaan", "Krishna",
  "Ananya", "Diya", "Meera", "Riya", "Sara"
];

function randomValue() {
  return Math.floor(40 + Math.random() * 60); // realistic range
}

function generateHistory(): { timestamp: number; value: number }[] {
  const now = Date.now();
  const points = [];

  let base = randomValue();

  for (let i = 0; i < 20; i++) {
    base += Math.random() * 10 - 5; // smooth variation
    base = Math.max(0, Math.min(100, base));

    points.push({
      timestamp: now - (20 - i) * 60000,
      value: Math.round(base),
    });
  }

  return points;
}

export function generateStudents(count = 20): Student[] {
  return Array.from({ length: count }).map((_, i) => {
    const history = generateHistory();
    return {
      id: `s-${i}`,
      name: NAMES[i % NAMES.length] + " " + (i + 1),
      concentration: history[history.length - 1].value,
      history,
    };
  });
}