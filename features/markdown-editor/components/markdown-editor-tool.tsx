"use client";

import { useId, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPanel, ToolLabel } from "@/components/tools/tool-panel";
import { useDownloadFile } from "@/hooks/use-download-file";
import { renderMarkdown } from "@/features/markdown-editor/lib/render";

const SAMPLE = `# Toolbox

A **premium**, ad-free collection of online tools.

- Fast
- Focused
- No sign-up

> Built for people who ship.

\`\`\`ts
const hello = "world";
\`\`\`
`;

export default function MarkdownEditorTool() {
  const markdownId = useId();
  const [source, setSource] = useState(SAMPLE);
  const html = useMemo(() => renderMarkdown(source), [source]);
  const download = useDownloadFile();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => download("document.md", source, "text/markdown")}>
          <Download size={14} />
          Download .md
        </Button>
        <Button variant="outline" size="sm" onClick={() => download("document.html", html, "text/html")}>
          <Download size={14} />
          Download .html
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ToolPanel>
          <ToolLabel id={markdownId}>Markdown</ToolLabel>
          <Textarea aria-labelledby={markdownId} rows={18} value={source} onChange={(e) => setSource(e.target.value)} />
        </ToolPanel>
        <ToolPanel>
          <ToolLabel>Preview</ToolLabel>
          <div
            className="markdown-preview rounded-lg bg-muted px-4 py-3"
            aria-label="Rendered markdown preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </ToolPanel>
      </div>
    </div>
  );
}
