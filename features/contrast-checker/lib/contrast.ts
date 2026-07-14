export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Returns NaN (not a throw) for malformed hex input — callers should check Number.isFinite. */
export function contrastRatio(hexA: string, hexB: string): number {
  const L1 = relativeLuminance(hexA);
  const L2 = relativeLuminance(hexB);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface WcagCheck {
  label: string;
  pass: boolean;
}

export function getWcagChecks(ratio: number): WcagCheck[] {
  return [
    { label: "AA · Normal text", pass: ratio >= 4.5 },
    { label: "AA · Large text", pass: ratio >= 3 },
    { label: "AAA · Normal text", pass: ratio >= 7 },
    { label: "AAA · Large text", pass: ratio >= 4.5 },
  ];
}