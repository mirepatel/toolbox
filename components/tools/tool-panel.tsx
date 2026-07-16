import { cn } from "@/lib/utils";

export function ToolPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-border bg-panel p-5 sm:p-6", className)}>{children}</div>;
}

export function ToolLabel({
  children,
  id,
  visuallyHidden = false,
}: {
  children: React.ReactNode;
  id?: string;
  visuallyHidden?: boolean;
}) {
  return (
    <label id={id} className={cn("mb-1.5 block text-xs font-medium text-muted-foreground", visuallyHidden && "sr-only")}>
      {children}
    </label>
  );
}
