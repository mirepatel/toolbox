"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useAppStore } from "@/hooks/use-app-store";
import { TOOLS } from "@/lib/tools-registry";
import { ICONS } from "@/lib/icons";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const addRecent = useAppStore((s) => s.addRecent);

  useKeyboardShortcut({ key: "k", metaOrCtrl: true, onTrigger: () => onOpenChange(!open) });

  const filtered = TOOLS.filter((tool) => {
    const q = query.toLowerCase();
    return (
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  function select(slug: string) {
    addRecent(slug);
    onOpenChange(false);
    setQuery("");
    router.push(`/tools/${slug}`);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput value={query} onValueChange={setQuery} placeholder="Search tools…" aria-label="Search tools" autoFocus />
      <CommandList>
        <CommandEmpty>No tools found{query ? ` for "${query}"` : ""}.</CommandEmpty>
        {filtered.map((tool) => {
          const Icon = ICONS[tool.icon];
          return (
            <CommandItem key={tool.slug} value={tool.slug} onSelect={() => select(tool.slug)}>
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
        })}
      </CommandList>
    </CommandDialog>
  );
}
