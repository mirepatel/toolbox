"use client";

import { useCallback } from "react";

/** Triggers a browser download of `content` as a file — text or binary, no backend involved. */
export function useDownloadFile() {
  return useCallback((filename: string, content: BlobPart, mimeType = "text/plain") => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);
}