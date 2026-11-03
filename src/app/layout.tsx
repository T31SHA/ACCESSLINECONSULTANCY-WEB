import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

// Self-hosted, vendored WOFF2 (OFL; latin subset, variable axes), preloaded. Two families only.
const syne = localFont({ src: "../fonts/syne-latin-var.woff2", weight: "600 700", variable: "--font-syne", display: "swap", preload: true });
const inter = localFont({ src: "../fonts/inter-latin-var.woff2", weight: "100 900", variable: "--font-inter", display: "swap", preload: true });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "PR & Brand Strategy Agency in Nairobi | Accessline", template: "%s | Accessline" },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#014F29", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${syne.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
