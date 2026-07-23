"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import {
  formatTime,
  nextPhase,
  PHASE_LABELS,
  type PomodoroPhase,
} from "@/features/pomodoro-timer/lib/timer";

const DEFAULT_DURATIONS: Record<PomodoroPhase, number> = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function PomodoroTimerTool() {
  const workId = useId();
  const shortBreakId = useId();
  const longBreakId = useId();

  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);
  const originalTitleRef = useRef("");

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
    };
  }, []);

  // Show a live countdown in the tab title while running, so it's glanceable from another tab.
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(secondsLeft)} · ${PHASE_LABELS[phase]}`;
    } else if (originalTitleRef.current) {
      document.title = originalTitleRef.current;
    }
  }, [secondsLeft, isRunning, phase]);

  const advancePhase = useCallback(() => {
    setPhase((current) => {
      const completed = current === "work" ? completedWorkSessions + 1 : completedWorkSessions;
      if (current === "work") setCompletedWorkSessions(completed);
      const next = nextPhase(current, completed);
      setSecondsLeft(durations[next] * 60);
      return next;
    });
  }, [completedWorkSessions, durations]);

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
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="text-sm font-medium text-muted-foreground">{PHASE_LABELS[phase]}</div>
          <div
            className="font-mono text-7xl font-semibold tracking-tight tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(secondsLeft)}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsRunning((r) => !r)} size="lg">
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={reset} variant="outline" size="lg" aria-label="Reset timer">
              <RotateCcw size={16} />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {completedWorkSessions} focus session{completedWorkSessions === 1 ? "" : "s"} completed
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
