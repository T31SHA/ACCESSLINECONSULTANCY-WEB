import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const body = z.object({ email: z.email().max(254), website: z.string().max(500).optional() });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`nl:${ip}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (db) {
    await db
      .insert(schema.newsletterSubscribers)
      .values({ email: parsed.data.email, confirmToken: randomBytes(24).toString("hex") })
      .onConflictDoNothing();
    // TODO(P3): send double-opt-in confirmation email via Resend + /api/newsletter/confirm route.
  }
  return NextResponse.json({ ok: true });
}
