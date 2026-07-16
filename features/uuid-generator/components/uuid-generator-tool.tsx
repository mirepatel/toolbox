"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const COUNTS = [1, 5, 10, 20] as const;

export default function UuidGeneratorTool() {
  const quantityId = useId();
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const copy = useCopyToClipboard();

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => {
      const id = crypto.randomUUID();
      return uppercase ? id.toUpperCase() : id;
    });
    setUuids(list);
  }, [count, uppercase]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <ToolLabel id={quantityId}>Quantity</ToolLabel>
            <select
              aria-labelledby={quantityId}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none"
            >
              {COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <Button variant={uppercase ? "default" : "outline"} size="sm" onClick={() => setUppercase((u) => !u)}>
            Uppercase
          </Button>
          <Button onClick={generate}>
            <RefreshCw size={14} />
            Generate
          </Button>
          {uuids.length > 0 && (
            <Button variant="outline" onClick={() => copy(uuids.join("\n"), "All UUIDs copied")}>
              Copy all
            </Button>
          )}
        </div>
      </ToolPanel>

      <ToolPanel>
        <div className="space-y-2" aria-live="polite" aria-label="Generated UUIDs">
          {uuids.map((id, i) => (
            <div
              key={`${id}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3.5 py-2.5 font-mono text-sm"
            >
              <span className="truncate">{id}</span>
              <Button variant="outline" size="sm" onClick={() => copy(id)}>
                Copy
              </Button>
            </div>
          ))}
        </div>
      </ToolPanel>
    </div>
  );
}
