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

/**
 * Plays a short two-note chime via the Web Audio API — no audio file or
 * dependency needed. The AudioContext must be created during a real user
 * gesture (e.g. a click) or browsers will silently block playback; callers
 * should create and reuse one AudioContext rather than a fresh one per call.
 */
export function playChime(ctx: AudioContext): void {
  const now = ctx.currentTime;
  [880, 1108.73].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.5);
  });
}

export function notifyPhaseComplete(title: string, body: string): void {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/icon.svg" });
}
