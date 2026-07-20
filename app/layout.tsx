import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

// Falls back to localhost in dev; set NEXT_PUBLIC_SITE_URL in your deployment
// environment once there's a real domain, so OG images and canonical URLs resolve correctly.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Toolbox — the tools you reach for, built right",
    template: "%s — Toolbox",
  },
  description:
    "A fast, focused toolkit for developers and creators. No sign-up, no clutter, no ads.",
  openGraph: {
    title: "Toolbox — the tools you reach for, built right",
    description:
      "A fast, focused toolkit for developers and creators. No sign-up, no clutter, no ads.",
    url: siteUrl,
    siteName: "Toolbox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolbox — the tools you reach for, built right",
    description:
      "A fast, focused toolkit for developers and creators. No sign-up, no clutter, no ads.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
