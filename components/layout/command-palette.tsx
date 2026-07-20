"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useAppStore } from "@/hooks/use-app-store";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
import { ICONS } from "@/lib/icons";
import type { Tool } from "@/types/tool";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ToolRow({ tool, onSelect }: { tool: Tool; onSelect: () => void }) {
  const Icon = ICONS[tool.icon];
  return (
    <CommandItem value={tool.slug} onSelect={onSelect}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
        <Icon size={13} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{tool.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{tool.description}</span>
      </span>
      <span className="shrink-0 text-[11px] text-muted-foreground">{tool.category}</span>
    </CommandItem>
  );
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const addRecent = useAppStore((s) => s.addRecent);
  const recentSlugs = useAppStore((s) => s.recents);

  useKeyboardShortcut({ key: "k", metaOrCtrl: true, onTrigger: () => onOpenChange(!open) });

  const isSearching = query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const recentTools = useMemo(
    () =>
      recentSlugs
        .map((slug) => getToolBySlug(slug))
        .filter((t): t is Tool => Boolean(t))
        .slice(0, 5),
    [recentSlugs]
  );

  const popularTools = useMemo(() => TOOLS.filter((t) => t.popular).slice(0, 5), []);

  function select(slug: string) {
    addRecent(slug);
    onOpenChange(false);
    setQuery("");
    router.push(`/tools/${slug}`);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search tools…"
        aria-label="Search tools"
        autoFocus
      />
      <CommandList>
        <CommandEmpty>No tools found{query ? ` for "${query}"` : ""}.</CommandEmpty>

        {isSearching ? (
          <CommandGroup heading="Results">
            {filtered.map((tool) => (
              <ToolRow key={tool.slug} tool={tool} onSelect={() => select(tool.slug)} />
            ))}
          </CommandGroup>
        ) : (
          <>
            {recentTools.length > 0 && (
              <CommandGroup heading="Recent">
                {recentTools.map((tool) => (
                  <ToolRow key={tool.slug} tool={tool} onSelect={() => select(tool.slug)} />
                ))}
              </CommandGroup>
            )}
            <CommandGroup heading="Popular">
              {popularTools.map((tool) => (
                <ToolRow key={tool.slug} tool={tool} onSelect={() => select(tool.slug)} />
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
