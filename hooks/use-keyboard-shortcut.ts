"use client";

import { useEffect } from "react";

interface Options {
  key: string;
  metaOrCtrl?: boolean;
  onTrigger: () => void;
  enabled?: boolean;
}

/** Registers a global keydown listener for a single shortcut, cleaned up on unmount. */
export function useKeyboardShortcut({ key, metaOrCtrl = false, onTrigger, enabled = true }: Options) {
  useEffect(() => {
    if (!enabled) return;

    function handler(event: KeyboardEvent) {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesModifier = metaOrCtrl ? event.metaKey || event.ctrlKey : true;
      if (matchesKey && matchesModifier) {
        event.preventDefault();
        onTrigger();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, metaOrCtrl, onTrigger, enabled]);
}
