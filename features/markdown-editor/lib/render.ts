import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/**
 * Renders markdown to HTML for local preview only. `marked` does not sanitize
 * HTML in the source — fine here since this is the user's own content
 * rendered back to themselves, never persisted or shared. If this tool ever
 * grows a "share preview" or multi-user feature, run the output through a
 * sanitizer (e.g. DOMPurify) before that happens.
 */
export function renderMarkdown(source: string): string {
  const result = marked.parse(source, { async: false });
  return typeof result === "string" ? result : "";
}