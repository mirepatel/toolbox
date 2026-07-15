export function percentOf(percent: number, value: number): number {
  return (percent / 100) * value;
}

export function isWhatPercent(part: number, whole: number): number {
  if (whole === 0) return NaN;
  return (part / whole) * 100;
}

export function percentChange(from: number, to: number): number {
  if (from === 0) return NaN;
  return ((to - from) / from) * 100;
}