"use client";

import { useState } from "react";
import { Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { FileDropZone } from "@/components/tools/file-drop-zone";
import { useDownloadFile } from "@/hooks/use-download-file";
import { convertToMp3, type Mp3Bitrate } from "@/features/audio-converter/lib/convert";

const BITRATES: Mp3Bitrate[] = [128, 192, 320];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AudioConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<Mp3Bitrate>(192);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const download = useDownloadFile();

  function addFiles(files: File[]) {
    const wav = files.find((f) => f.type === "audio/wav" || f.name.toLowerCase().endsWith(".wav"));
    setError(wav ? null : "Please choose a WAV file.");
    if (wav) setFile(wav);
  }

  async function handleConvert() {
    if (!file) return;
    setIsConverting(true);
    setError(null);
    try {
      const mp3Blob = await convertToMp3(file, bitrate);
      const outputName = file.name.replace(/\.wav$/i, "") + ".mp3";
      download(outputName, mp3Blob, "audio/mp3");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't convert this file.");
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FileDropZone
          accept="audio/wav,.wav"
          multiple={false}
          onFiles={addFiles}
          label="Drop a WAV file here, or click to browse"
        />
        {error && (
          <div className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </div>
        )}
      </ToolPanel>

      {file && (
        <ToolPanel>
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted px-3.5 py-2.5">
            <Music size={16} className="shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{file.name}</div>
              <div className="text-xs text-muted-foreground">{formatBytes(file.size)}</div>
            </div>
          </div>

          <ToolLabel id="bitrate-label">MP3 quality</ToolLabel>
          <div className="mb-4 flex gap-2" role="group" aria-labelledby="bitrate-label">
            {BITRATES.map((rate) => (
              <Button
                key={rate}
                variant={bitrate === rate ? "default" : "outline"}
                size="sm"
                aria-pressed={bitrate === rate}
                onClick={() => setBitrate(rate)}
              >
                {rate} kbps
              </Button>
            ))}
          </div>

          <Button onClick={handleConvert} disabled={isConverting}>
            {isConverting && <Loader2 size={14} className="animate-spin" />}
            {isConverting ? "Converting…" : "Convert to MP3"}
          </Button>
        </ToolPanel>
      )}
    </div>
  );
}
