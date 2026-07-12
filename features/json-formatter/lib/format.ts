export interface FormatResult {
  text: string;
  error: string | null;
}

export function formatJson(input: string, mode: "format" | "minify", indent: 2 | 4): FormatResult {
  try {
    const parsed = JSON.parse(input);
    const text = mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
    return { text, error: null };
  } catch (e) {
    return { text: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
