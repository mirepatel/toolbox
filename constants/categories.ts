import type { ToolCategory } from "@/types/tool";
import type { IconName } from "@/lib/icons";

export const CATEGORIES: { id: ToolCategory; icon: IconName }[] = [
  { id: "Image", icon: "Image" },
  { id: "PDF", icon: "FileText" },
  { id: "Developer", icon: "Code2" },
  { id: "AI", icon: "Sparkles" },
  { id: "Video", icon: "Video" },
  { id: "Audio", icon: "Music" },
  { id: "Utilities", icon: "Zap" },
  { id: "Calculators", icon: "Calculator" },
  { id: "Color", icon: "Palette" },
  { id: "Typography", icon: "Type" },
  { id: "Text", icon: "AlignLeft" },
  { id: "Security", icon: "Shield" },
  { id: "QR", icon: "QrCode" },
  { id: "Converters", icon: "ArrowRightLeft" },
  { id: "Files", icon: "Files" },
  { id: "Productivity", icon: "ListChecks" },
];
