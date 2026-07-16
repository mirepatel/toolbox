"use client";

import { useId, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { computeTextStats } from "@/features/word-counter/lib/stats";

const SAMPLE =
  "Paste or type your text here. Toolbox counts words, characters, sentences, and estimates reading time as you go.";

export default function WordCounterTool() {
  const textId = useId();
  const [text, setText] = useState(SAMPLE);
  const stats = useMemo(() => computeTextStats(text), [text]);

  const items = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: `${stats.readingTimeMinutes} min` },
  ];

  return (
    <div className="space-y-4">
      <ToolPanel>
        <ToolLabel id={textId} visuallyHidden>
          Text to analyze
        </ToolLabel>
        <Textarea aria-labelledby={textId} rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      </ToolPanel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite" aria-label="Text statistics">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-panel px-4 py-3.5">
            <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
