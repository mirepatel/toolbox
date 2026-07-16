"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { percentOf, isWhatPercent, percentChange } from "@/features/percentage-calculator/lib/percentage";

type Mode = "percentOf" | "isWhatPercent" | "percentChange";

const MODES: { id: Mode; label: string }[] = [
  { id: "percentOf", label: "X% of Y" },
  { id: "isWhatPercent", label: "X is what % of Y" },
  { id: "percentChange", label: "% change" },
];

const LABELS: Record<Mode, [string, string, string]> = {
  percentOf: ["Percentage", "Of value", "Result"],
  isWhatPercent: ["Part", "Whole", "Is what percent"],
  percentChange: ["From", "To", "Change"],
};

export default function PercentageCalculatorTool() {
  const modeGroupId = useId();
  const aId = useId();
  const bId = useId();
  const resultId = useId();
  const [mode, setMode] = useState<Mode>("percentOf");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");

  const result = useMemo(() => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (Number.isNaN(numA) || Number.isNaN(numB)) return null;

    if (mode === "percentOf") return percentOf(numA, numB);
    if (mode === "isWhatPercent") return isWhatPercent(numA, numB);
    return percentChange(numA, numB);
  }, [mode, a, b]);

  const [labelA, labelB, labelResult] = LABELS[mode];
  const showsPercentSign = mode !== "percentOf";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Calculation mode" id={modeGroupId}>
        {MODES.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "default" : "outline"}
            size="sm"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <ToolPanel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <ToolLabel id={aId}>{labelA}</ToolLabel>
            <Input aria-labelledby={aId} type="number" value={a} onChange={(e) => setA(e.target.value)} className="font-mono" />
          </div>
          <div>
            <ToolLabel id={bId}>{labelB}</ToolLabel>
            <Input aria-labelledby={bId} type="number" value={b} onChange={(e) => setB(e.target.value)} className="font-mono" />
          </div>
        </div>
        <div className="mt-5">
          <ToolLabel id={resultId}>{labelResult}</ToolLabel>
          <div className="rounded-lg bg-muted px-4 py-4 font-mono text-2xl" aria-live="polite" aria-labelledby={resultId}>
            {result !== null ? `${Number(result.toFixed(4))}${showsPercentSign ? "%" : ""}` : "—"}
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
