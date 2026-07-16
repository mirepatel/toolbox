"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { generatePalette } from "@/features/color-palette/lib/color";

export default function ColorPaletteTool() {
  const [palette, setPalette] = useState<string[]>([]);
  const copy = useCopyToClipboard();

  const generate = useCallback(() => setPalette(generatePalette()), []);

  useEffect(() => generate(), [generate]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (e.code === "Space" && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        generate();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={generate}>
          <RefreshCw size={14} />
          Generate
        </Button>
        <span className="text-xs text-muted-foreground">or press space</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" aria-live="polite" aria-label="Generated color palette">
        {palette.map((hex, i) => (
          <button
            key={`${hex}-${i}`}
            onClick={() => copy(hex)}
            aria-label={`Copy color ${hex.toUpperCase()}`}
            className="flex h-36 flex-col justify-end rounded-xl p-3 text-left transition hover:-translate-y-0.5"
            style={{ backgroundColor: hex }}
          >
            <span className="w-fit rounded bg-white/85 px-2 py-1 font-mono text-xs text-neutral-900">
              {hex.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
