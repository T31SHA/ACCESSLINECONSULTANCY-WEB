import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { emailConfigured, notifyInbox } from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const body = z.object({ email: z.email().max(254), website: z.string().max(500).optional() });

/** Newsletter signup → emailed to LEADS_INBOX (add the address to your mailing tool manually). No database. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`nl:${ip}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (!emailConfigured()) return NextResponse.json({ error: "Sign-up is temporarily unavailable. Please try again later." }, { status: 503 });

  const email = parsed.data.email.toLowerCase();
  const sent = await notifyInbox(`Newsletter signup — ${email}`, "Newsletter signup", { Email: email, "Submitted at": new Date() }, email);
  if (!sent) return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
