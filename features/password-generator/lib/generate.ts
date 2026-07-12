export interface PasswordOptions {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

// Ambiguous characters (0/O, 1/l/I) are excluded for readability.
const CHARSETS: Record<keyof PasswordOptions, string> = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnpqrstuvwxyz",
  numbers: "23456789",
  symbols: "!@#$%^&*-_=+?",
};

const POOL_SIZES: Record<keyof PasswordOptions, number> = {
  upper: 24,
  lower: 24,
  numbers: 8,
  symbols: 13,
};

function activeKeys(options: PasswordOptions): (keyof PasswordOptions)[] {
  return (Object.keys(options) as (keyof PasswordOptions)[]).filter((key) => options[key]);
}

export function generatePassword(length: number, options: PasswordOptions): string {
  const pool = activeKeys(options)
    .map((key) => CHARSETS[key])
    .join("");
  if (!pool) return "";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => pool[n % pool.length]).join("");
}

export function estimateStrength(length: number, options: PasswordOptions): { label: string; pct: number } {
  const poolSize = activeKeys(options).reduce((sum, key) => sum + POOL_SIZES[key], 0);
  if (poolSize === 0) return { label: "—", pct: 0 };
  const bits = Math.round(length * Math.log2(poolSize));
  if (bits < 40) return { label: "Weak", pct: 25 };
  if (bits < 60) return { label: "Fair", pct: 50 };
  if (bits < 80) return { label: "Strong", pct: 75 };
  return { label: "Very strong", pct: 100 };
}
