"use client";

import { Star } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { TOOLS } from "@/lib/tools-registry";
import { ToolGrid } from "@/components/tools/tool-grid";
import { EmptyState } from "@/components/tools/empty-state";

export default function FavoritesPage() {
  const favoriteSlugs = useAppStore((s) => s.favorites);
  const favoriteTools = TOOLS.filter((t) => favoriteSlugs.includes(t.slug));

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-6">
      <div className="mb-8 flex items-center gap-2">
        <Star size={18} className="fill-accent text-accent" />
        <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
      </div>
      {favoriteTools.length > 0 ? (
        <ToolGrid tools={favoriteTools} />
      ) : (
        <EmptyState
          title="No favorites yet"
          subtitle="Star a tool from its card or its page to pin it here."
        />
      )}
    </main>
  );
}
