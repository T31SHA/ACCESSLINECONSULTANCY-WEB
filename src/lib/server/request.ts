import "server-only";
import type { NextRequest } from "next/server";

/** Client IP behind Cloudflare / a reverse proxy (Hostinger), else null. */
export const clientIp = (req: NextRequest) =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

/** Two-letter country code when Cloudflare supplies one. */
export const clientCountry = (req: NextRequest) =>
  req.headers.get("cf-ipcountry") ?? null;
