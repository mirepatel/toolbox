"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { testRegex } from "@/features/regex-tester/lib/regex";

const SAMPLE_PATTERN = "\\b[A-Z][a-z]+\\b";
const SAMPLE_TEXT = "Toolbox helps Developers and Designers ship Faster.";

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState(SAMPLE_TEXT);

  const result = useMemo(() => testRegex(pattern, flags, testText), [pattern, flags, testText]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">/</span>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" />
          <span className="font-mono text-sm text-muted-foreground">/</span>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            className="w-16 rounded-lg border border-border bg-panel px-2 py-2.5 font-mono text-sm outline-none"
          />
        </div>
        {result.error && <div className="mt-2 text-sm text-red-500">{result.error}</div>}
      </ToolPanel>

      <ToolPanel>
        <ToolLabel>Test string</ToolLabel>
        <Textarea rows={4} value={testText} onChange={(e) => setTestText(e.target.value)} className="mb-4" />
        <ToolLabel>Highlighted matches</ToolLabel>
        <div className="whitespace-pre-wrap rounded-lg bg-muted px-3.5 py-3 font-mono text-sm leading-relaxed">
          {result.segments.map((segment, i) =>
            segment.isMatch ? (
              <mark key={i} className="rounded bg-accent/30 px-0.5 text-inherit">
                {segment.text}
              </mark>
            ) : (
              <span key={i}>{segment.text}</span>
            )
          )}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {result.matches.length} match{result.matches.length === 1 ? "" : "es"}
        </div>
      </ToolPanel>
    </div>
  );
}