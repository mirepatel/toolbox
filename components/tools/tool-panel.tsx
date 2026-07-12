import { cn } from "@/lib/utils";

export function ToolPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-border bg-panel p-5 sm:p-6", className)}>{children}</div>;
}

export function ToolLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{children}</label>;
}
