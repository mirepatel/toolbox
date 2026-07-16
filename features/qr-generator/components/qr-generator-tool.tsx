"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SIZES = [160, 240, 320] as const;

export default function QrGeneratorTool() {
  const textId = useId();
  const sizeGroupId = useId();
  const [text, setText] = useState("https://claude.ai");
  const [size, setSize] = useState<(typeof SIZES)[number]>(240);

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text || " ")}`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ToolPanel>
        <ToolLabel id={textId}>Text or URL</ToolLabel>
        <Input aria-labelledby={textId} value={text} onChange={(e) => setText(e.target.value)} className="mb-4" />
        <ToolLabel id={sizeGroupId}>Size</ToolLabel>
        <div className="flex gap-2" role="group" aria-labelledby={sizeGroupId}>
          {SIZES.map((s) => (
            <Button key={s} variant={size === s ? "default" : "outline"} size="sm" aria-pressed={size === s} onClick={() => setSize(s)}>
              {s}px
            </Button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Rendered via a public QR API — the code only ever contains what you type above. Swap this
          for a client-side QR library (e.g. `qrcode`) if generating offline matters for your deployment.
        </p>
      </ToolPanel>
      <ToolPanel>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-border bg-muted p-3">
            {/* Remote, data-driven image size — intentionally unoptimized via next/image */}
            <Image src={url} alt="Generated QR code" width={size} height={size} unoptimized />
          </div>
          <a href={url} target="_blank" rel="noreferrer" className="text-sm text-accent underline underline-offset-2">
            Open full size
          </a>
        </div>
      </ToolPanel>
    </div>
  );
}
