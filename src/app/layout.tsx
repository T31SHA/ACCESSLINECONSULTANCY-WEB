import type { Metadata, Viewport } from "next";
import { inter, syne } from "@/lib/fonts";
import { site } from "@/content/site";
import "./globals.css";


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
