"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

/**
 * All client-side context lives here so app/layout.tsx (a Server Component)
 * stays server-rendered. next-themes handles the dark-mode class on <html>
 * with no flash-of-wrong-theme; TanStack Query is wired up ready for tools
 * that need live data (currency rates, etc.) even though nothing uses it yet.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
