"use client";

import { useState } from "react";
import { FileText, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel } from "@/components/tools/tool-panel";
import { FileDropZone } from "@/components/tools/file-drop-zone";
import { useDownloadFile } from "@/hooks/use-download-file";
import { mergePdfFiles } from "@/features/merge-pdf/lib/merge";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const download = useDownloadFile();

  function addFiles(newFiles: File[]) {
    const pdfsOnly = newFiles.filter((f) => f.type === "application/pdf");
    setError(pdfsOnly.length < newFiles.length ? "Only PDF files are accepted — others were skipped." : null);
    setFiles((prev) => [...prev, ...pdfsOnly]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const a = next[index];
      const b = next[target];
      if (!a || !b) return prev;
      next[index] = b;
      next[target] = a;
      return next;
    });
  }

  async function handleMerge() {
    if (files.length < 2) {
      setError("Add at least two PDFs to merge.");
      return;
    }
    setIsMerging(true);
    setError(null);
    try {
      const pdfBlob = await mergePdfFiles(files);
      download("merged.pdf", pdfBlob, "application/pdf");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't merge these PDFs — one might be corrupted or password-protected."
      );
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FileDropZone accept="application/pdf" onFiles={addFiles} label="Drop PDFs here, or click to browse" />
      </ToolPanel>

      {files.length > 0 && (
        <ToolPanel>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg bg-muted px-3.5 py-2.5">
                <FileText size={16} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{formatBytes(file.size)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => moveFile(i, -1)} disabled={i === 0} aria-label="Move up">
                    <ArrowUp size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveFile(i, 1)}
                    disabled={i === files.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(i)} aria-label="Remove">
                    <X size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-500" role="alert">
              {error}
            </div>
          )}

          <Button onClick={handleMerge} disabled={isMerging || files.length < 2} className="mt-4">
            {isMerging && <Loader2 size={14} className="animate-spin" />}
            {isMerging ? "Merging…" : `Merge ${files.length} PDFs`}
          </Button>
        </ToolPanel>
      )}
    </div>
  );
}
