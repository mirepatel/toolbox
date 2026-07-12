import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ToolSkeleton } from "@/components/tools/tool-skeleton";

/**
 * Maps a tool slug to its feature component. Each entry is code-split via
 * next/dynamic so a tool's dependencies never bloat the shared bundle.
 *
 * A tool present in TOOLS but absent here automatically falls back to the
 * shared ComingSoon state — see app/tools/[slug]/page.tsx.
 */
export const toolComponents: Record<string, ComponentType> = {
  "json-formatter": dynamic(
    () => import("@/features/json-formatter/components/json-formatter-tool"),
    { loading: () => <ToolSkeleton /> }
  ),
  "uuid-generator": dynamic(
    () => import("@/features/uuid-generator/components/uuid-generator-tool"),
    { loading: () => <ToolSkeleton /> }
  ),
  "password-generator": dynamic(
    () => import("@/features/password-generator/components/password-generator-tool"),
    { loading: () => <ToolSkeleton /> }
  ),
  "qr-generator": dynamic(
    () => import("@/features/qr-generator/components/qr-generator-tool"),
    { loading: () => <ToolSkeleton /> }
  ),
  "color-palette": dynamic(
    () => import("@/features/color-palette/components/color-palette-tool"),
    { loading: () => <ToolSkeleton /> }
  ),
  "unit-converter": dynamic(
    () => import("@/features/unit-converter/components/unit-converter-tool"),
    { loading: () => <ToolSkeleton /> }
  ),
  "word-counter": dynamic(
  () => import("@/features/word-counter/components/word-counter-tool"),
  { loading: () => <ToolSkeleton /> }
  ),
};
