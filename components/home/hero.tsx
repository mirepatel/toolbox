"use client";

import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/constants/categories";
import { CategoryPill } from "@/components/tools/category-pill";
import { TOOLS } from "@/lib/tools-registry";

interface HeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeCategory: string;
  onCategoryChange: (c: string) => void;
}

export function Hero({ query, onQueryChange, activeCategory, onCategoryChange }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, var(--color-accent-soft), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 pb-14 pt-16 text-center sm:pb-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
        >
          <Sparkles size={12} />
          {TOOLS.length}+ tools · zero ads
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
        >
          The tools you reach for,
          <br />
          built right.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
        >
          A fast, focused toolkit for developers and creators. No sign-up, no clutter, no surprise
          upsells.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto mt-9 max-w-xl"
        >
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search JSON formatter, password generator, QR code…"
            aria-label="Search tools"
            className="w-full rounded-xl border border-border bg-panel py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-neutral-400"
          />
        </motion.div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <CategoryPill label="All" active={activeCategory === "All"} onClick={() => onCategoryChange("All")} />
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.id}
              icon={cat.icon}
              active={activeCategory === cat.id}
              onClick={() => onCategoryChange(cat.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
