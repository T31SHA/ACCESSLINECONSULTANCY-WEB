import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { sendNewsletterConfirmation } from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const body = z.object({ email: z.email().max(254), website: z.string().max(500).optional() });

/** Double opt-in: store as pending with a one-time token and email a confirmation link. */
export async function POST(req: NextRequest) {
  const db = await getDb();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`nl:${ip}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (!db) {
    // Dev without a DB: accept. Production: don't pretend to subscribe someone we can't store.
    return process.env.NODE_ENV === "production"
      ? NextResponse.json({ error: "Sign-up is temporarily unavailable. Please try again later." }, { status: 503 })
      : NextResponse.json({ ok: true });
  }

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select().from(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.email, email)).limit(1);
  // Already confirmed: respond identically (no enumeration), send nothing.
  if (existing?.status === "confirmed") return NextResponse.json({ ok: true });

  const token = randomBytes(24).toString("base64url");
  if (existing) {
    await db.update(schema.newsletterSubscribers).set({ status: "pending", confirmToken: token, createdAt: new Date() }).where(eq(schema.newsletterSubscribers.id, existing.id));
  } else {
    await db.insert(schema.newsletterSubscribers).values({ email, confirmToken: token });
  }
  await sendNewsletterConfirmation(email, token);
  // Test hook: lets E2E complete the opt-in without an inbox. Impossible to enable on Vercel production.
  const exposeToken = process.env.E2E_EXPOSE_TOKENS === "1" && process.env.VERCEL_ENV !== "production" && !process.env.RESEND_API_KEY;
  return NextResponse.json(exposeToken ? { ok: true, debugToken: token } : { ok: true });
}
