import { Wand2 } from "lucide-react";
import type { Tool } from "@/types/tool";

export function ComingSoon({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-panel px-8 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Wand2 size={20} />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">{tool.name} is on the way</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        This entry exists in the catalog but doesn&apos;t have a component wired up yet. Add one to{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">features/{tool.slug}/</code> and register it in{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">lib/tool-components.tsx</code>.
      </p>
    </div>
  );
}
