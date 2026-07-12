"use client";

import { useCallback } from "react";
import { toast } from "sonner";

/** Copies text to the clipboard and surfaces a toast either way. */
export function useCopyToClipboard() {
  return useCallback(async (text: string, successMessage = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch {
      toast.error("Couldn't copy — select and copy manually");
    }
  }, []);
}
