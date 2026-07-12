# Toolbox

The tools you reach for, built right. A premium, ad-free collection of online
tools — Next.js 15 App Router, TypeScript, Tailwind v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Press **⌘K** (or Ctrl+K) anywhere to open the
command palette.

## Stack

Next.js 15 (App Router, Server Components) · React 19 · TypeScript ·
Tailwind CSS v4 · Zustand (favorites/recents, persisted) · next-themes (dark
mode) · TanStack Query (wired up, ready for tools that fetch live data) ·
React Hook Form + Zod (ready for form-heavy tools) · Framer Motion ·
Radix UI + cmdk (command palette) · sonner (toasts) · Lucide icons.

## Architecture

```
app/                    Routes only. Pages stay thin — they read the
                         registry / params and hand off to components.
components/
  ui/                   Unstyled-ish primitives (button, input, dialog,
                         command...) in the shadcn/ui pattern — swap in the
                         real shadcn CLI output any time without touching
                         call sites, since the API shape matches.
  layout/                Header, Footer, Providers, CommandPalette.
  tools/                 Shared pieces every tool page/card uses:
                         ToolCard, ToolGrid, ToolPanel, ComingSoon, etc.
  home/                   Homepage-only composition (Hero, HomeView, Newsletter).
features/<slug>/         One folder per tool. `lib/` holds pure, testable
                         logic; `components/` holds the UI. Nothing outside
                         a tool's own folder should import its internals.
lib/tools-registry.ts    Single source of truth for the catalog — name,
                         description, category, icon, flags.
lib/tool-components.tsx  Maps a slug to its feature component via
                         next/dynamic (code-split, lazy-loaded). A tool with
                         no entry here automatically renders ComingSoon.
hooks/                   useAppStore (Zustand), useKeyboardShortcut,
                         useCopyToClipboard.
types/, constants/       Shared Tool type and the 16-category list.
```

## Adding a new tool

1. Add an entry to `lib/tools-registry.ts` (name, description, category, icon).
   It now shows up on the homepage, in search, and in the command palette
   with a "coming soon" tool page — no other wiring required.
2. Build it: `features/<slug>/components/<slug>-tool.tsx`, plus a `lib/`
   file for any pure logic you'd want to unit test.
3. Register it in `lib/tool-components.tsx` so the real component replaces
   ComingSoon.

That's it — routing, metadata, favoriting, search, and the command palette
all key off the registry automatically.

## What's real vs. stubbed right now

**Fully functional:** JSON Formatter, UUID Generator, Password Generator,
QR Code Generator, Palette Generator, Unit Converter.

**Cataloged but not built** (render the shared ComingSoon state): everything
else in `lib/tools-registry.ts`. Add these incrementally — see above.

**Intentionally not wired up yet, since nothing needs them:**
- **UploadThing** — add it when you build the first upload-based tool
  (Background Remover, Image Compressor, etc).
- **React Hook Form + Zod** — installed and ready; none of the current tools
  are complex enough to need structured form validation. A good first
  candidate: Loan Calculator or BMI Calculator.
- **TanStack Query** — the provider is mounted in `components/layout/providers.tsx`;
  wire it up for the first tool that needs live data (Currency Converter).

## Notes on a few deliberate choices

- **Theme** uses `next-themes` rather than a hand-rolled store, since it
  handles the SSR/hydration flash problem correctly out of the box. Favorites
  and recents live in Zustand with the `persist` middleware instead.
- **Tailwind v4** is configured CSS-first in `app/globals.css` (`@theme` +
  `@custom-variant dark`) — there's no `tailwind.config.ts`; that's expected
  in v4, not a missing file.
- **QR Generator** calls a public QR image API rather than shipping a QR
  library, to keep the bundle small. Swap in a client-side library (e.g.
  `qrcode`) if offline generation matters for your deployment.
- The `components/ui/*` primitives are hand-written in the shadcn/ui pattern
  (cva variants, `cn()` merge, Radix underneath) rather than generated via
  the shadcn CLI, so this scaffold has zero interactive setup steps. Running
  `npx shadcn@latest init` later will slot in cleanly since the API matches.

## Commands

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # eslint
npm run format   # prettier --write .
```
