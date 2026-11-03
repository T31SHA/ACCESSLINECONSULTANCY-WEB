import { NextResponse, type NextRequest } from "next/server";
import { leadPayloadSchema, leadSchema, shortLeadSchema } from "@/lib/lead-schema";
import { emailConfigured, notifyInbox, sendLeadAutoReply } from "@/lib/server/email";
import { site } from "@/content/site";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const runtime = "nodejs";

const ip = (req: NextRequest) =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

/** Simple heuristic lead score (0–100), included in the email for triage. */
function score(d: { budgetBand?: string; timeline?: string; serviceInterest?: string[]; phone?: string }) {
  let s = 10;
  s += { "5m_plus": 40, "2m_5m": 30, "500k_2m": 20, under_500k: 5, undecided: 5 }[d.budgetBand ?? ""] ?? 0;
  s += { asap: 25, "1_3_months": 20, "3_6_months": 10, exploring: 0 }[d.timeline ?? ""] ?? 0;
  s += Math.min((d.serviceInterest?.length ?? 0) * 5, 15);
  if (d.phone) s += 10;
  return Math.min(s, 100);
}

/** Contact, lead and "Start a project" forms → email to LEADS_INBOX (reply-to = submitter). No database. */
export async function POST(req: NextRequest) {
  const clientIp = ip(req);
  const rl = await rateLimit(`lead:${clientIp ?? "anon"}`);
  if (!rl.success) return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });

  const json = await req.json().catch(() => null);
  const payload = leadPayloadSchema.safeParse(json);
  if (!payload.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { variant, data, meta, turnstileToken, website } = payload.data;

  // Honeypot: pretend success so bots learn nothing.
  if (website) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(turnstileToken, clientIp))) {
    return NextResponse.json({ error: "Verification failed. Please refresh and try again." }, { status: 400 });
  }

  const parsed = variant === "full" ? leadSchema.safeParse(data) : shortLeadSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const d = parsed.data as Partial<import("@/lib/lead-schema").LeadInput> & { fullName: string; email: string };

  if (!emailConfigured()) {
    console.error("[leads] email is not configured (RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS) — lead rejected");
    return NextResponse.json({ error: `We couldn't send your brief right now. Please email ${site.email}.` }, { status: 503 });
  }

  const fields = {
    "Full name": d.fullName,
    Email: d.email,
    Phone: d.phone,
    Organisation: d.organisation,
    Role: d.role,
    Country: req.headers.get("cf-ipcountry") ?? req.headers.get("x-vercel-ip-country") ?? undefined,
    "Services of interest": d.serviceInterest,
    Industry: d.industry,
    Budget: d.budgetBand,
    Timeline: d.timeline,
    Message: d.message,
    "Marketing consent": d.consentMarketing ? "yes" : "no",
    "Lead score": score(d),
    Form: variant === "full" ? "Detailed brief" : "Short enquiry",
    "Source page": meta.sourcePage,
    "UTM source": meta.utmSource,
    "UTM medium": meta.utmMedium,
    "UTM campaign": meta.utmCampaign,
    Referrer: meta.referrer,
    "Submitted at": new Date(),
  };

  const sent = await notifyInbox(`New enquiry — ${d.organisation || d.fullName}`, "New enquiry", fields, d.email);
  if (!sent) return NextResponse.json({ error: `We couldn't send your brief right now. Please email ${site.email}.` }, { status: 502 });

  await sendLeadAutoReply(d.email, d.fullName).catch(() => false);
  return NextResponse.json({ ok: true });
}
