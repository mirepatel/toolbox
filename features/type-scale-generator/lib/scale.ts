export interface ScaleStep {
  /** 0 = base size, positive = larger, negative = smaller */
  step: number;
  px: number;
  rem: number;
}

export function generateScale(baseSizePx: number, ratio: number, stepsUp: number, stepsDown: number): ScaleStep[] {
  const steps: ScaleStep[] = [];
  for (let i = stepsUp; i >= -stepsDown; i--) {
    const px = baseSizePx * Math.pow(ratio, i);
    steps.push({
      step: i,
      px: Math.round(px * 100) / 100,
      rem: Math.round((px / 16) * 1000) / 1000,
    });
  }
  return steps;
}