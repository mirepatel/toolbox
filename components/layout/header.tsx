"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandPalette } from "@/components/layout/command-palette";
import { useAppStore } from "@/hooks/use-app-store";

export function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const favoritesCount = useAppStore((s) => s.favorites.length);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <Sparkles size={15} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Toolbox</span>
        </Link>

        <button
          onClick={() => setPaletteOpen(true)}
          className="mx-4 hidden max-w-md flex-1 items-center gap-2.5 rounded-lg border border-border bg-panel px-3.5 py-2 text-sm text-muted-foreground transition hover:border-neutral-400 sm:flex"
        >
          <Search size={15} />
          <span className="flex-1 text-left">Search tools…</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px]">⌘K</kbd>
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setPaletteOpen(true)} aria-label="Search">
            <Search size={17} />
          </Button>
          <Link
            href="/favorites"
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted"
          >
            <Star size={14} className={favoritesCount > 0 ? "fill-accent text-accent" : ""} />
            <span className="hidden sm:inline">{favoritesCount}</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
