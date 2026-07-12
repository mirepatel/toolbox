export type UnitCategory = "length" | "weight" | "temperature";

export const UNIT_OPTIONS: Record<UnitCategory, string[]> = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
  weight: ["mg", "g", "kg", "oz", "lb"],
  temperature: ["C", "F", "K"],
};

const LENGTH_TO_METERS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const WEIGHT_TO_KG: Record<string, number> = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  oz: 0.0283495,
  lb: 0.453592,
};

function toCelsius(value: number, unit: string): number {
  if (unit === "C") return value;
  if (unit === "F") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(celsius: number, unit: string): number {
  if (unit === "C") return celsius;
  if (unit === "F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export function convertUnits(category: UnitCategory, rawValue: string, from: string, to: string): string {
  const value = parseFloat(rawValue);
  if (Number.isNaN(value)) return "";

  let result: number;
  if (category === "temperature") {
    result = fromCelsius(toCelsius(value, from), to);
  } else {
    const table = category === "length" ? LENGTH_TO_METERS : WEIGHT_TO_KG;
    const fromFactor = table[from] ?? 1;
    const toFactor = table[to] ?? 1;
    result = (value * fromFactor) / toFactor;
  }
  return String(Math.round(result * 1e6) / 1e6);
}
