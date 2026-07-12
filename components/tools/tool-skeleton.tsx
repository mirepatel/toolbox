import { Skeleton } from "@/components/ui/skeleton";

export function ToolSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-panel p-8">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
