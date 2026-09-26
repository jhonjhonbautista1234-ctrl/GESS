export interface SurveyPoint { id: string; x: number; y: number; label: string; }
export interface Question { prompt: string; choices: string[]; answer: number; explanation: string; }
export interface Mission {
  id: string; name: string; concept: string; description: string; tool: string;
  note: string; task: string; points: SurveyPoint[]; questions: Question[];
}

export const missions: Mission[] = [
  {
    id: "city-grid", name: "The City Grid", concept: "Coordinates & traversing",
    description: "Connect control points and bring your survey back home.", tool: "Total station",
    note: "A total station measures angles and distances. A known station and a backsight reference orient the survey. Easting increases east; northing increases north. A closed traverse returns to its starting point.",
    task: "Follow the control points in order: A → B → C → D → A. Select each marker to record it. This ideal square has 40 m sides.",
    points: [
      { id: "a", x: 28, y: 72, label: "A · E 100, N 100 m" },
      { id: "b", x: 28, y: 28, label: "B · E 100, N 140 m" },
      { id: "c", x: 72, y: 28, label: "C · E 140, N 140 m" },
      { id: "d", x: 72, y: 72, label: "D · E 140, N 100 m" },
      { id: "a-return", x: 28, y: 72, label: "Return to A · close the loop" },
    ],
    questions: [
      { prompt: "From B to C, which coordinate changes?", choices: ["Northing increases 40 m", "Easting increases 40 m", "Elevation increases 40 m"], answer: 1, explanation: "B is (100, 140) and C is (140, 140). You move 40 m east with no change in northing." },
      { prompt: "Your measured return is E 100.03, N 100.04 m. How far is it from A (100, 100)?", choices: ["0.07 m", "0.01 m", "0.05 m"], answer: 2, explanation: "Linear misclosure = √(ΔE² + ΔN²) = √(0.03² + 0.04²) = 0.05 m. Real observations rarely close perfectly; closure helps assess survey quality." },
    ],
  },
  {
    id: "coastal-bay", name: "The Coastal Bay", concept: "Depth & hydrography",
    description: "Send a sonar pulse and discover the shape below the water.", tool: "Echo sounder",
    note: "An echo sounder times a sound pulse travelling to the seabed and back. Depth below the transducer = sound speed × round-trip time ÷ 2. These simplified examples use 1,500 m/s and omit tide, vessel motion, and transducer draft corrections.",
    task: "Collect three soundings along the boat route. The labels show each pulse’s round-trip travel time.",
    points: [
      { id: "s1", x: 22, y: 35, label: "S1 · 0.020 s" },
      { id: "s2", x: 50, y: 50, label: "S2 · 0.040 s" },
      { id: "s3", x: 78, y: 65, label: "S3 · 0.060 s" },
    ],
    questions: [
      { prompt: "At S2, the echo returns in 0.040 s. At 1,500 m/s, what is the depth below the transducer?", choices: ["60 m", "30 m", "15 m"], answer: 1, explanation: "1,500 × 0.040 ÷ 2 = 30 m. Divide by two because the pulse travels down AND back up." },
      { prompt: "Which sounding is deepest, assuming the same sound speed?", choices: ["S1 · 0.020 s", "S2 · 0.040 s", "S3 · 0.060 s"], answer: 2, explanation: "S3 takes longest to return: 1,500 × 0.060 ÷ 2 = 45 m. The three depths are 15, 30, and 45 m." },
    ],
  },
  {
    id: "mountain-pass", name: "The Mountain Pass", concept: "Levelling & contours",
    description: "Transfer an elevation and learn to read the landscape.", tool: "Automatic level & staff",
    note: "A benchmark has a known elevation. Height of instrument = benchmark elevation + backsight reading. New elevation = height of instrument − foresight reading. Contour lines connect equal elevations; close spacing means a steeper slope.",
    task: "Record the benchmark, backsight, and foresight in order. All staff readings and elevations are in metres.",
    points: [
      { id: "bm", x: 22, y: 72, label: "Benchmark · 100.000 m" },
      { id: "bs", x: 48, y: 48, label: "Backsight · 1.482 m" },
      { id: "fs", x: 76, y: 26, label: "Foresight · 1.096 m" },
    ],
    questions: [
      { prompt: "What is the new point’s elevation? Use 100.000 + 1.482 − 1.096.", choices: ["100.386 m", "99.614 m", "102.578 m"], answer: 0, explanation: "The instrument’s line of sight is at 101.482 m. Subtract the foresight reading of 1.096 m to obtain 100.386 m." },
      { prompt: "On a map with a fixed contour interval, closely spaced contours indicate…", choices: ["A flat area", "A steeper slope", "A change in map scale"], answer: 1, explanation: "The same vertical rise happens over a shorter horizontal distance, so the slope is steeper." },
    ],
  },
];

export const storageKey = "gess-survey-quest-v1";
export function readProgress(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    // Only accept a contiguous sequence of completed missions.
    const completed: string[] = [];
    for (const mission of missions) {
      if (!value.includes(mission.id)) break;
      completed.push(mission.id);
    }
    return completed;
  } catch { return []; }
}
