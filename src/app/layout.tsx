import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/ui/json-ld";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { site } from "@/content/site";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

// Self-hosted WOFF2 (next/font), preloaded, two families only.
const syne = Syne({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-syne", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "PR & Brand Strategy Agency in Nairobi | Accessline", template: "%s | Accessline" },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#014F29",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en-KE" className={`${syne.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-accent-400 focus:px-5 focus:py-3 focus:font-semibold focus:text-ink-950">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">{children}</main>
        <Footer />
        <RevealObserver />
        <JsonLd data={organizationSchema()} />
        {plausibleDomain && (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.tagged-events.outbound-links.js" strategy="lazyOnload" />
        )}
      </body>
    </html>
  );
}
