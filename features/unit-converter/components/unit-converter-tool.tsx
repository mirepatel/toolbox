"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { UNIT_OPTIONS, convertUnits, type UnitCategory } from "@/features/unit-converter/lib/convert";

export default function UnitConverterTool() {
  const fromId = useId();
  const toId = useId();
  const [category, setCategory] = useState<UnitCategory>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState("1");

  function changeCategory(next: UnitCategory) {
    const options = UNIT_OPTIONS[next];
    setCategory(next);
    setFrom(options[0] ?? "");
    setTo(options[1] ?? options[0] ?? "");
  }

  const output = useMemo(() => convertUnits(category, value, from, to), [category, value, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="group" aria-label="Unit category">
        {(["length", "weight", "temperature"] as const).map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            size="sm"
            aria-pressed={category === cat}
            onClick={() => changeCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      <ToolPanel>
        <div className="grid items-end gap-4 sm:grid-cols-[1fr,auto,1fr]">
          <div>
            <ToolLabel id={fromId}>From</ToolLabel>
            <div className="flex gap-2">
              <Input aria-labelledby={fromId} value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
              <select
                aria-label="From unit"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none"
              >
                {UNIT_OPTIONS[category].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={swap} className="justify-self-center" aria-label="Swap units">
            <ArrowRightLeft size={15} />
          </Button>
          <div>
            <ToolLabel id={toId}>To</ToolLabel>
            <div className="flex gap-2">
              <div
                className="flex-1 truncate rounded-lg border border-border bg-muted px-3.5 py-2.5 font-mono text-sm"
                aria-live="polite"
                aria-labelledby={toId}
              >
                {output || "—"}
              </div>
              <select
                aria-label="To unit"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none"
              >
                {UNIT_OPTIONS[category].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </ToolPanel>
    </div>
  );
}
