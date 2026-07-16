export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export function isWebCryptoAvailable(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
}

export async function computeHash(algorithm: HashAlgorithm, text: string): Promise<string> {
  if (!isWebCryptoAvailable()) {
    throw new Error(
      "crypto.subtle isn't available here — it needs a secure context (HTTPS, or a real browser tab at http://localhost). Restricted preview panels, like VS Code's built-in browser, block it."
    );
  }
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
