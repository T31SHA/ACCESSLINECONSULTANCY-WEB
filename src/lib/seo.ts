import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
};

/** Builds unique title/description, canonical, OG and Twitter metadata for a route. */
export function pageMetadata({ title, description, path, type = "website", noindex }: PageMeta): Metadata {
  const url = new URL(path, site.url).toString();
  // Keep the rendered <title> ≤60 chars: add the brand suffix only when it fits.
  const suffixed = `${title} | Accessline`;
  const full = suffixed.length <= 60 ? suffixed : title.slice(0, 60);
  // Default OG card; segment-level opengraph-image files take precedence.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }];
  return {
    title: { absolute: full },
    description: description.length > 155 ? `${description.slice(0, 152).trimEnd()}…` : description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type, siteName: site.name, locale: site.locale, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
