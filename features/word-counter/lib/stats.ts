export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export function computeTextStats(text: string): TextStats {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+(?=\s|$)/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
  const readingTimeMinutes = Math.max(1, Math.round(words / 200));
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTimeMinutes };
}