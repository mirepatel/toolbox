import {
  Code2,
  Binary,
  KeyRound,
  QrCode,
  Palette,
  Ruler,
  Eye,
  Hash,
  AlignLeft,
  Wand2,
  Files,
  Sparkles,
  Video,
  Music,
  Timer,
  Calculator,
  Type,
  RefreshCw,
  ListChecks,
  Image,
  FileText,
  Zap,
  Shield,
  ArrowRightLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Tool/category data holds icon *names* (plain strings), not component
 * references — component functions can't cross the Server -> Client
 * Component boundary (they're not serializable in the RSC payload). This
 * map resolves a name to the real component, and should only be imported
 * from Client Components.
 */
export const ICONS = {
  Code2,
  Binary,
  KeyRound,
  QrCode,
  Palette,
  Ruler,
  Eye,
  Hash,
  AlignLeft,
  Wand2,
  Files,
  Sparkles,
  Video,
  Music,
  Timer,
  Calculator,
  Type,
  RefreshCw,
  ListChecks,
  Image,
  FileText,
  Zap,
  Shield,
  ArrowRightLeft,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
