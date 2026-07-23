export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export const PHASE_LABELS: Record<PomodoroPhase, string> = {
  work: "Focus",
  shortBreak: "Short break",
  longBreak: "Long break",
};

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** After every 4th completed focus session, take a long break; otherwise a short one. Any break returns to work. */
export function nextPhase(current: PomodoroPhase, completedWorkSessions: number): PomodoroPhase {
  if (current !== "work") return "work";
  return completedWorkSessions % 4 === 0 ? "longBreak" : "shortBreak";
}
