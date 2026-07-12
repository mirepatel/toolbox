import { cn } from "@/lib/utils";
import { ICONS, type IconName } from "@/lib/icons";

interface CategoryPillProps {
  label: string;
  icon?: IconName;
  active: boolean;
  onClick: () => void;
}

export function CategoryPill({ label, icon, active, onClick }: CategoryPillProps) {
  const Icon = icon ? ICONS[icon] : null;
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
        active
          ? "border-transparent bg-accent text-white"
          : "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      {Icon && <Icon size={13} />}
      {label}
    </button>
  );
}
