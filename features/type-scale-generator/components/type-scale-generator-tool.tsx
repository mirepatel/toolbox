"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { generateScale } from "@/features/type-scale-generator/lib/scale";

const RATIOS = [
  { label: "Minor Third", value: 1.2 },
  { label: "Major Third", value: 1.25 },
  { label: "Perfect Fourth", value: 1.333 },
  { label: "Perfect Fifth", value: 1.5 },
  { label: "Golden Ratio", value: 1.618 },
];

export default function TypeScaleGeneratorTool() {
  const baseSizeId = useId();
  const stepsUpId = useId();
  const stepsDownId = useId();
  const ratioId = useId();
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [stepsUp, setStepsUp] = useState(5);
  const [stepsDown, setStepsDown] = useState(2);
  const copy = useCopyToClipboard();

  const scale = useMemo(
    () => generateScale(baseSize, ratio, stepsUp, stepsDown),
    [baseSize, ratio, stepsUp, stepsDown]
  );

  const cssBlock = useMemo(() => {
    const lines = scale.map(
      (s) => `  --text-${s.step === 0 ? "base" : s.step > 0 ? `up-${s.step}` : `down-${Math.abs(s.step)}`}: ${s.rem}rem;`
    );
    return `:root {\n${lines.join("\n")}\n}`;
  }, [scale]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <ToolLabel id={baseSizeId}>Base size (px)</ToolLabel>
            <Input
              aria-labelledby={baseSizeId}
              type="number"
              value={baseSize}
              onChange={(e) => setBaseSize(Number(e.target.value) || 16)}
            />
          </div>
          <div>
            <ToolLabel id={stepsUpId}>Steps up</ToolLabel>
            <Input
              aria-labelledby={stepsUpId}
              type="number"
              min={0}
              max={10}
              value={stepsUp}
              onChange={(e) => setStepsUp(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div>
            <ToolLabel id={stepsDownId}>Steps down</ToolLabel>
            <Input
              aria-labelledby={stepsDownId}
              type="number"
              min={0}
              max={5}
              value={stepsDown}
              onChange={(e) => setStepsDown(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div>
            <ToolLabel id={ratioId}>Ratio</ToolLabel>
            <select
              aria-labelledby={ratioId}
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none"
            >
              {RATIOS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} ({r.value})
                </option>
              ))}
            </select>
          </div>
        </div>
      </ToolPanel>

      <ToolPanel>
        <div className="space-y-3" aria-live="polite" aria-label="Type scale preview">
          {scale.map((s) => (
            <div
              key={s.step}
              className="flex items-baseline justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <span className="truncate font-semibold tracking-tight" style={{ fontSize: `${s.px}px` }}>
                Aa
              </span>
              <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-muted-foreground">
                <span>{s.step === 0 ? "base" : s.step > 0 ? `+${s.step}` : s.step}</span>
                <span>{s.px}px</span>
                <span>{s.rem}rem</span>
              </div>
            </div>
          ))}
        </div>
      </ToolPanel>

      <ToolPanel>
        <div className="mb-2 flex items-center justify-between">
          <ToolLabel>CSS custom properties</ToolLabel>
          <Button variant="outline" size="sm" onClick={() => copy(cssBlock)}>
            Copy
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-muted px-3.5 py-3 font-mono text-xs" aria-live="polite">
          {cssBlock}
        </pre>
      </ToolPanel>
    </div>
  );
}
