"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { cn } from "@/lib/utils";
import {
  formatTime,
  nextPhase,
  playChime,
  notifyPhaseComplete,
  PHASE_LABELS,
  type PomodoroPhase,
} from "@/features/pomodoro-timer/lib/timer";

const DEFAULT_DURATIONS: Record<PomodoroPhase, number> = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};
const DEFAULT_TITLE = "Focus session";

export default function PomodoroTimerTool() {
  const titleId = useId();
  const workId = useId();
  const shortBreakId = useId();
  const longBreakId = useId();

  const [sessionTitle, setSessionTitle] = useState("");
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const originalTitleRef = useRef("");

  const displayTitle = sessionTitle.trim() || DEFAULT_TITLE;
  const phaseLabel = phase === "work" ? displayTitle : PHASE_LABELS[phase];
  const cyclePosition = completedWorkSessions % 4;
  const cycleNumber = Math.floor(completedWorkSessions / 4) + 1;

  // Keeps the countdown in sync if durations are edited while paused.
  useEffect(() => {
    if (!isRunning) setSecondsLeft(durations[phase] * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations, phase]);

  // Capture the page's real title once, restore it on unmount.
  useEffect(() => {
    originalTitleRef.current = document.title;
    return () => {
      document.title = originalTitleRef.current;
      audioContextRef.current?.close();
    };
  }, []);

  // Show a live countdown in the tab title while running.
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(secondsLeft)} · ${phaseLabel}`;
    } else if (originalTitleRef.current) {
      document.title = originalTitleRef.current;
    }
  }, [secondsLeft, isRunning, phaseLabel]);

  // Advancing PAUSES rather than auto-continuing — makes each transition a
  // deliberate, noticeable moment instead of silently rolling into the next phase.
  const advancePhase = useCallback(() => {
    const completed = phase === "work" ? completedWorkSessions + 1 : completedWorkSessions;
    if (phase === "work") setCompletedWorkSessions(completed);
    const next = nextPhase(phase, completed);
    setPhase(next);
    setSecondsLeft(durations[next] * 60);
    setIsRunning(false);

    if (soundEnabled && audioContextRef.current) playChime(audioContextRef.current);
    if (notificationsEnabled) {
      const message =
        next === "work" ? "Break's over — back to it!" : "Nice work — time for a break.";
      notifyPhaseComplete("Toolbox — Pomodoro", message);
    }
  }, [phase, completedWorkSessions, durations, soundEnabled, notificationsEnabled]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          advancePhase();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, advancePhase]);

  function toggleRunning() {
    if (!isRunning && soundEnabled && !audioContextRef.current) {
      // Created during this click (a real user gesture) so later programmatic
      // playback from the interval callback isn't blocked by autoplay policy.
      audioContextRef.current = new AudioContext();
    }
    setIsRunning((r) => !r);
  }

  async function toggleNotifications() {
    if (typeof Notification === "undefined") return;
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === "granted");
  }

  function reset() {
    setIsRunning(false);
    setPhase("work");
    setCompletedWorkSessions(0);
    setSecondsLeft(durations.work * 60);
  }

  function updateDuration(key: PomodoroPhase, minutes: number) {
    setDurations((d) => ({ ...d, [key]: Math.max(1, minutes) }));
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="flex flex-col items-center gap-5 py-6">
          {/* Cycle position — 4 dots per long-break cycle, current one highlighted */}
          <div
            className="flex items-center gap-2"
            role="img"
            aria-label={`Cycle ${cycleNumber}, session ${cyclePosition + 1} of 4`}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i < cyclePosition || (i === cyclePosition && phase !== "work")
                    ? "bg-accent"
                    : i === cyclePosition
                      ? "bg-accent ring-2 ring-accent/30"
                      : "bg-muted"
                )}
              />
            ))}
          </div>

          {phase === "work" ? (
            <input
              id={titleId}
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder={DEFAULT_TITLE}
              aria-label="What are you focusing on?"
              className="w-full max-w-xs rounded-md border-none bg-transparent text-center text-sm font-medium text-muted-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent"
            />
          ) : (
            <div className="text-sm font-medium text-muted-foreground">{phaseLabel}</div>
          )}

          <div
            className="font-mono text-7xl font-semibold tracking-tight tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(secondsLeft)}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={toggleRunning} size="lg">
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={reset} variant="outline" size="lg" aria-label="Reset timer">
              <RotateCcw size={16} />
            </Button>
            <Button
              onClick={() => setSoundEnabled((s) => !s)}
              variant="outline"
              size="lg"
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Mute chime" : "Unmute chime"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
            <Button
              onClick={toggleNotifications}
              variant="outline"
              size="lg"
              aria-pressed={notificationsEnabled}
              aria-label={
                notificationsEnabled
                  ? "Disable desktop notifications"
                  : "Enable desktop notifications"
              }
            >
              {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Cycle {cycleNumber} · {completedWorkSessions} session
            {completedWorkSessions === 1 ? "" : "s"} completed
          </div>
        </div>
      </ToolPanel>

      <ToolPanel>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <ToolLabel id={workId}>Focus (minutes)</ToolLabel>
            <Input
              aria-labelledby={workId}
              type="number"
              min={1}
              value={durations.work}
              onChange={(e) => updateDuration("work", Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <ToolLabel id={shortBreakId}>Short break (minutes)</ToolLabel>
            <Input
              aria-labelledby={shortBreakId}
              type="number"
              min={1}
              value={durations.shortBreak}
              onChange={(e) => updateDuration("shortBreak", Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <ToolLabel id={longBreakId}>Long break (minutes)</ToolLabel>
            <Input
              aria-labelledby={longBreakId}
              type="number"
              min={1}
              value={durations.longBreak}
              onChange={(e) => updateDuration("longBreak", Number(e.target.value) || 1)}
            />
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
