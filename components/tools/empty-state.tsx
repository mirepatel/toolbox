import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Search size={16} className="text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 rounded-lg border border-border px-3.5 py-1.5 text-sm transition hover:bg-muted"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
