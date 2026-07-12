"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { Tool } from "@/types/tool";
import { ICONS } from "@/lib/icons";
import { useAppStore } from "@/hooks/use-app-store";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const isFavorite = useAppStore((s) => s.favorites.includes(tool.slug));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const addRecent = useAppStore((s) => s.addRecent);
  const Icon = ICONS[tool.icon];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={() => addRecent(tool.slug)}
      className="group relative rounded-xl border border-border bg-panel p-4 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={16} />
        </span>
        <div className="flex items-center gap-1.5">
          {tool.trending && (
            <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              Trending
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(tool.slug);
            }}
            aria-label="Toggle favorite"
            className={cn(
              "rounded-md p-1 transition hover:bg-muted",
              isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <Star size={14} className={isFavorite ? "fill-accent text-accent" : "text-neutral-400"} />
          </button>
        </div>
      </div>
      <h3 className="mb-1 text-sm font-medium">{tool.name}</h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
      <div className="mt-3 text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
        {tool.category}
      </div>
    </Link>
  );
}
