import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  icon?: LucideIcon;
  count?: number;
}

export function SectionHeading({ title, icon: Icon, count }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {Icon && <Icon size={15} className="text-muted-foreground" />}
      <h2 className="text-[15px] font-medium">{title}</h2>
      {typeof count === "number" && <span className="text-sm text-neutral-400 dark:text-neutral-600">{count}</span>}
    </div>
  );
}
