export interface TimerSnapshot {
  mode: "FOCUS" | "BREAK";
  remainingMs: number;
  courseId?: string;
  savedAt: number;
}
