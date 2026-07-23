"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { FileDropZone } from "@/components/tools/file-drop-zone";
import { useDownloadFile } from "@/hooks/use-download-file";
import {
  convertImage,
  type ImageFormat,
  type ConvertedImage,
} from "@/features/image-converter/lib/convert";

const FORMATS: { label: string; value: ImageFormat; ext: string }[] = [
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "JPEG", value: "image/jpeg", ext: "jpg" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>("image/webp");
  const [quality, setQuality] = useState(92);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertedImage | null>(null);
  const download = useDownloadFile();

  // Revokes the previous object URL whenever it changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function addFiles(files: File[]) {
    const image = files.find((f) => f.type.startsWith("image/"));
    if (!image) {
      setError("Please choose a PNG, JPEG, or WebP image.");
      return;
    }
    setError(null);
    setResult(null);
    setFile(image);
    setPreviewUrl(URL.createObjectURL(image));
  }

  async function handleConvert() {
    if (!file) return;
    setIsConverting(true);
    setError(null);
    try {
      const converted = await convertImage(file, format, quality / 100);
      setResult(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't convert this image.");
    } finally {
      setIsConverting(false);
    }
  }

  function handleDownload() {
    if (!result || !file) return;
    const ext = FORMATS.find((f) => f.value === format)?.ext ?? "img";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    download(`${baseName}.${ext}`, result.blob, format);
  }

  return (
    <div className="space-y-4">
      <ToolPanel>
        <FileDropZone
          accept="image/png,image/jpeg,image/webp"
          multiple={false}
          onFiles={addFiles}
          label="Drop a PNG, JPEG, or WebP image here, or click to browse"
        />
        {error && (
          <div className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </div>
        )}
      </ToolPanel>

      {file && previewUrl && (
        <ToolPanel>
          <div className="mb-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview URL, not a remote/optimizable image */}
            <img src={previewUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{file.name}</div>
              <div className="text-xs text-muted-foreground">{formatBytes(file.size)}</div>
            </div>
          </div>

          <ToolLabel id="format-label">Convert to</ToolLabel>
          <div className="mb-4 flex gap-2" role="group" aria-labelledby="format-label">
            {FORMATS.map((f) => (
              <Button
                key={f.value}
                variant={format === f.value ? "default" : "outline"}
                size="sm"
                aria-pressed={format === f.value}
                onClick={() => setFormat(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {format !== "image/png" && (
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <ToolLabel id="quality-label">Quality</ToolLabel>
                <span className="font-mono text-sm text-muted-foreground">{quality}%</span>
              </div>
              <input
                type="range"
                aria-labelledby="quality-label"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          )}

          <Button onClick={handleConvert} disabled={isConverting}>
            {isConverting && <Loader2 size={14} className="animate-spin" />}
            {isConverting ? "Converting…" : "Convert"}
          </Button>
        </ToolPanel>
      )}

      {result && file && (
        <ToolPanel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Original</div>
                <div className="font-mono">{formatBytes(file.size)}</div>
              </div>
              <div className="text-muted-foreground">→</div>
              <div>
                <div className="text-xs text-muted-foreground">Converted</div>
                <div className="font-mono">{formatBytes(result.blob.size)}</div>
              </div>
            </div>
            <Button variant="outline" onClick={handleDownload}>
              Download
            </Button>
          </div>
        </ToolPanel>
      )}
    </div>
  );
}
