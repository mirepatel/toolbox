"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import type { Tool } from "@/types/tool";
import { useAppStore } from "@/hooks/use-app-store";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/lib/icons";

export function ToolPageHeader({ tool }: { tool: Tool }) {
  const isFavorite = useAppStore((s) => s.favorites.includes(tool.slug));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const Icon = ICONS[tool.icon];

  return (
    <div className="mb-8">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={14} />
        All tools
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon size={19} />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{tool.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => toggleFavorite(tool.slug)}>
          <Star size={14} className={isFavorite ? "fill-accent text-accent" : ""} />
          {isFavorite ? "Favorited" : "Favorite"}
        </Button>
      </div>
    </div>
  );
}
