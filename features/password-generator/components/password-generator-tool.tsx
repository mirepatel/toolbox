"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { generatePassword, estimateStrength, type PasswordOptions } from "@/features/password-generator/lib/generate";

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const copy = useCopyToClipboard();

  const generate = useCallback(() => setPassword(generatePassword(length, options)), [length, options]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const strength = estimateStrength(length, options);
  const toggle = (key: keyof PasswordOptions) => setOptions((o) => ({ ...o, [key]: !o[key] }));

  return (
    <ToolPanel>
      <div className="mb-4 break-all rounded-lg bg-muted px-4 py-4 font-mono text-2xl">
        {password || "Select at least one character set"}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button onClick={generate}>
          <RefreshCw size={14} />
          Generate
        </Button>
        {password && (
          <Button variant="outline" onClick={() => copy(password)}>
            Copy
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-accent transition-all" style={{ width: `${strength.pct}%` }} />
          </div>
          <span className="text-muted-foreground">{strength.label}</span>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <ToolLabel>Length</ToolLabel>
        <span className="font-mono text-sm text-muted-foreground">{length}</span>
      </div>
      <input
        type="range"
        min={6}
        max={48}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="mb-5 w-full accent-accent"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant={options.upper ? "default" : "outline"} size="sm" onClick={() => toggle("upper")}>ABC</Button>
        <Button variant={options.lower ? "default" : "outline"} size="sm" onClick={() => toggle("lower")}>abc</Button>
        <Button variant={options.numbers ? "default" : "outline"} size="sm" onClick={() => toggle("numbers")}>123</Button>
        <Button variant={options.symbols ? "default" : "outline"} size="sm" onClick={() => toggle("symbols")}>#!$</Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Ambiguous characters like 0, O, 1, l, and I are excluded for readability.
      </p>
    </ToolPanel>
  );
}
