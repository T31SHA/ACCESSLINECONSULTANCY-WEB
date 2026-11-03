import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { site } from "@/content/site";
import { emailConfigured, renderFields, sendMail } from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rate-limit";
import { clientIp } from "@/lib/server/request";

export const runtime = "nodejs";

const body = z.object({ email: z.email().max(254), website: z.string().max(500).optional() });

/** Newsletter sign-up: emailed to LEADS_INBOX (reply-to = subscriber) for the team to add to their mailing list. */
export async function POST(req: NextRequest) {
  if (!(await rateLimit(`nl:${clientIp(req) ?? "anon"}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot

  if (!emailConfigured()) {
    console.error("[newsletter] email not configured (RESEND_API_KEY or SMTP_*) — sign-up rejected");
    return NextResponse.json({ error: "Sign-up is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const email = parsed.data.email.toLowerCase();
  try {
    await sendMail({
      subject: `Newsletter sign-up — ${email}`,
      replyTo: email,
      ...renderFields(`New ${site.name} newsletter sign-up`, [
        ["Email", email],
        ["Source page", req.headers.get("referer")],
        ["Submitted", new Date().toISOString()],
      ]),
    });
  } catch (err) {
    console.error("[newsletter] sending failed", err);
    return NextResponse.json({ error: "Sign-up failed. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
