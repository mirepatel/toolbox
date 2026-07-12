"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatJson } from "@/features/json-formatter/lib/format";

const SAMPLE = '{\n  "name": "Toolbox",\n  "tools": 20,\n  "premium": true\n}';

export default function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [indent, setIndent] = useState<2 | 4>(2);
  const copy = useCopyToClipboard();

  const result = useMemo(() => formatJson(input, mode, indent), [input, mode, indent]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={mode === "format" ? "default" : "outline"} size="sm" onClick={() => setMode("format")}>
          Format
        </Button>
        <Button variant={mode === "minify" ? "default" : "outline"} size="sm" onClick={() => setMode("minify")}>
          Minify
        </Button>
        <div className="ml-auto flex items-center gap-1.5">
          {([2, 4] as const).map((n) => (
            <Button
              key={n}
              variant={indent === n && mode === "format" ? "default" : "outline"}
              size="sm"
              onClick={() => setIndent(n)}
            >
              {n} spaces
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ToolPanel>
          <ToolLabel>Input</ToolLabel>
          <Textarea rows={14} value={input} onChange={(e) => setInput(e.target.value)} />
        </ToolPanel>
        <ToolPanel>
          <div className="mb-1.5 flex items-center justify-between">
            <ToolLabel>Output</ToolLabel>
            {result.text && (
              <Button variant="outline" size="sm" onClick={() => copy(result.text)}>
                Copy
              </Button>
            )}
          </div>
          {result.error ? (
            <div className="py-3 text-sm text-red-500">Invalid JSON — {result.error}</div>
          ) : (
            <Textarea rows={14} value={result.text} readOnly />
          )}
        </ToolPanel>
      </div>
    </div>
  );
}
