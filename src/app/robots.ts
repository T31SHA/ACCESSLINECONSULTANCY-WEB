import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return isProd
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] }], sitemap: absoluteUrl("/sitemap.xml") }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
