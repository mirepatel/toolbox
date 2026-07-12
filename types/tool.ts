import type { IconName } from "@/lib/icons";

export type ToolCategory =
  | "Image"
  | "PDF"
  | "Developer"
  | "AI"
  | "Video"
  | "Audio"
  | "Utilities"
  | "Calculators"
  | "Color"
  | "Typography"
  | "Text"
  | "Security"
  | "QR"
  | "Converters"
  | "Files"
  | "Productivity";

export interface Tool {
  /** URL slug, e.g. "json-formatter". Doubles as the registry key. */
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  /** Name of a Lucide icon, resolved via lib/icons.ts — see that file for why. */
  icon: IconName;
  /** Surfaced in the "Popular" home section. */
  popular?: boolean;
  /** Shows a "Trending" badge on the card. */
  trending?: boolean;
  /**
   * Whether a real tool component is wired up in lib/tool-components.tsx.
   * Tools without one render the shared ComingSoon state.
   */
  functional?: boolean;
}
