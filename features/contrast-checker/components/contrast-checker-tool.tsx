"use client";

import { useId, useMemo, useState } from "react";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { Input } from "@/components/ui/input";
import { contrastRatio, getWcagChecks } from "@/features/contrast-checker/lib/contrast";

export default function ContrastCheckerTool() {
  const fgId = useId();
  const bgId = useId();
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const validRatio = Number.isFinite(ratio) ? ratio : null;
  const checks = validRatio !== null ? getWcagChecks(validRatio) : [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ToolPanel>
        <div className="space-y-4">
          <div>
            <ToolLabel id={fgId}>Text color</ToolLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-labelledby={fgId}
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-border"
              />
              <Input aria-labelledby={fgId} value={fg} onChange={(e) => setFg(e.target.value)} className="font-mono" />
            </div>
          </div>
          <div>
            <ToolLabel id={bgId}>Background color</ToolLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-labelledby={bgId}
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-border"
              />
              <Input aria-labelledby={bgId} value={bg} onChange={(e) => setBg(e.target.value)} className="font-mono" />
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2" aria-live="polite" aria-label="WCAG contrast results">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
              <span>{check.label}</span>
              <span
                className={
                  check.pass
                    ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600"
                    : "rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600"
                }
              >
                {check.pass ? "Pass" : "Fail"}
              </span>
            </div>
          ))}
        </div>
      </ToolPanel>

      <ToolPanel>
        <div
          className="flex h-full flex-col items-center justify-center gap-6 rounded-xl p-8"
          style={{ backgroundColor: bg }}
        >
          <span className="text-3xl font-semibold" style={{ color: fg }}>
            Aa
          </span>
          <p className="text-center text-lg" style={{ color: fg }}>
            The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm" style={{ color: fg }}>
            Small print reads like this.
          </p>
          <div className="text-4xl font-bold" style={{ color: fg }} aria-live="polite">
            {validRatio !== null ? validRatio.toFixed(2) : "—"}:1
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
