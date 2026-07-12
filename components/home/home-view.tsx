"use client";

import { useMemo, useState } from "react";
import { Clock, TrendingUp } from "lucide-react";
import type { Tool } from "@/types/tool";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { SectionHeading } from "@/components/tools/section-heading";
import { ToolGrid } from "@/components/tools/tool-grid";
import { EmptyState } from "@/components/tools/empty-state";
import { useAppStore } from "@/hooks/use-app-store";

function matchesQuery(tool: Tool, q: string) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    tool.name.toLowerCase().includes(s) ||
    tool.description.toLowerCase().includes(s) ||
    tool.category.toLowerCase().includes(s)
  );
}

/** Client component: owns search/filter state and reads favorites/recents from the store. */
export function HomeView({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const recentSlugs = useAppStore((s) => s.recents);

  const filtered = useMemo(
    () => tools.filter((t) => (activeCategory === "All" || t.category === activeCategory) && matchesQuery(t, query)),
    [tools, activeCategory, query]
  );

  const popular = useMemo(() => tools.filter((t) => t.popular), [tools]);
  const recentTools = useMemo(
    () => recentSlugs.map((slug) => tools.find((t) => t.slug === slug)).filter((t): t is Tool => Boolean(t)),
    [recentSlugs, tools]
  );

  const showCurated = activeCategory === "All" && !query;
  const sectionTitle = query.trim()
    ? `Results for "${query.trim()}"`
    : activeCategory === "All"
      ? "All tools"
      : activeCategory;

  return (
    <main>
      <Hero query={query} onQueryChange={setQuery} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-6">
        {showCurated && (
          <section>
            <SectionHeading title="Popular" icon={TrendingUp} />
            <ToolGrid tools={popular} />
          </section>
        )}

        {showCurated && recentTools.length > 0 && (
          <section>
            <SectionHeading title="Recently used" icon={Clock} />
            <ToolGrid tools={recentTools} />
          </section>
        )}

        <section>
          <SectionHeading title={sectionTitle} count={filtered.length} />
          {filtered.length > 0 ? (
            <ToolGrid tools={filtered} />
          ) : (
            <EmptyState
              title="No tools match that search"
              subtitle="Try a different keyword, or browse by category instead."
              action={{
                label: "Clear filters",
                onClick: () => {
                  setQuery("");
                  setActiveCategory("All");
                },
              }}
            />
          )}
        </section>

        <Newsletter />
      </div>
    </main>
  );
}
