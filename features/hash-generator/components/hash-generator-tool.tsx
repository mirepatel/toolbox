"use client";

import { useEffect, useId, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { computeHash, type HashAlgorithm } from "@/features/hash-generator/lib/hash";

const ALGORITHMS: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export default function HashGeneratorTool() {
  const textId = useId();
  const algorithmGroupId = useId();
  const [input, setInput] = useState("Toolbox");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState<string | null>(null);
  const copy = useCopyToClipboard();

  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setHash("");
      setError(null);
      return;
    }
    computeHash(algorithm, input)
      .then((result) => {
        if (!cancelled) {
          setHash(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setHash("");
          setError(err instanceof Error ? err.message : "Couldn't compute the hash.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [input, algorithm]);

  return (
    <div className="space-y-4">
      <ToolPanel>
        <ToolLabel id={textId}>Text</ToolLabel>
        <Textarea aria-labelledby={textId} rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      </ToolPanel>
      <ToolPanel>
        <ToolLabel id={algorithmGroupId}>Algorithm</ToolLabel>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-labelledby={algorithmGroupId}>
          {ALGORITHMS.map((algo) => (
            <Button
              key={algo}
              variant={algorithm === algo ? "default" : "outline"}
              size="sm"
              aria-pressed={algorithm === algo}
              onClick={() => setAlgorithm(algo)}
            >
              {algo}
            </Button>
          ))}
        </div>
        {error ? (
          <div className="rounded-lg bg-red-500/10 px-3.5 py-3 text-sm text-red-600" role="alert">
            {error}
          </div>
        ) : (
          <div
            className="flex items-center justify-between gap-3 break-all rounded-lg bg-muted px-3.5 py-3 font-mono text-sm"
            aria-live="polite"
            aria-label="Hash output"
          >
            <span>{hash || "—"}</span>
            {hash && (
              <Button variant="outline" size="sm" onClick={() => copy(hash)}>
                Copy
              </Button>
            )}
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          SHA-1 is included for compatibility — prefer SHA-256 or higher for anything security-sensitive.
        </p>
      </ToolPanel>
    </div>
  );
}
