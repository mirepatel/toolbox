export function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/** Five-swatch gradient from a random base hue — analogous hues, descending lightness. */
export function generatePalette(): string[] {
  const base = Math.floor(Math.random() * 360);
  return [0, 1, 2, 3, 4].map((i) => hslToHex(base + i * 14, 62, 82 - i * 15));
}
