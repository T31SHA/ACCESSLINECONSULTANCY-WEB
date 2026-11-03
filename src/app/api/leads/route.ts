import { NextResponse, type NextRequest } from "next/server";
import { getDb, schema } from "@/db";
import { leadPayloadSchema, leadSchema, shortLeadSchema } from "@/lib/lead-schema";
import { emailConfigured, sendLeadAutoReply, sendLeadNotification } from "@/lib/server/email";
import { site } from "@/content/site";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const runtime = "nodejs";

const ip = (req: NextRequest) =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

/** Simple heuristic lead score (0–100) for triage in /admin. */
function score(d: { budgetBand?: string; timeline?: string; serviceInterest?: string[]; phone?: string }) {
  let s = 10;
  s += { "5m_plus": 40, "2m_5m": 30, "500k_2m": 20, under_500k: 5, undecided: 5 }[d.budgetBand ?? ""] ?? 0;
  s += { asap: 25, "1_3_months": 20, "3_6_months": 10, exploring: 0 }[d.timeline ?? ""] ?? 0;
  s += Math.min((d.serviceInterest?.length ?? 0) * 5, 15);
  if (d.phone) s += 10;
  return Math.min(s, 100);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
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

  const record = {
    fullName: d.fullName,
    email: d.email,
    phone: d.phone || null,
    organisation: d.organisation ?? null,
    role: d.role || null,
    country: req.headers.get("cf-ipcountry") ?? req.headers.get("x-vercel-ip-country") ?? null,
    serviceInterest: d.serviceInterest ?? [],
    industry: d.industry ?? null,
    budgetBand: d.budgetBand ?? null,
    timeline: d.timeline ?? null,
    message: d.message || null,
    sourcePage: meta.sourcePage ?? null,
    utmSource: meta.utmSource ?? null,
    utmMedium: meta.utmMedium ?? null,
    utmCampaign: meta.utmCampaign ?? null,
    referrer: meta.referrer ?? null,
    consentMarketing: d.consentMarketing ?? false,
    consentAt: new Date(),
    score: score(d),
  };

  // Never silently drop a lead: with no database and no notification channel, fail honestly.
  if (!db && !emailConfigured && process.env.NODE_ENV === "production") {
    console.error("[leads] neither DATABASE_URL nor RESEND_API_KEY/SLACK_WEBHOOK_URL configured — lead rejected");
    return NextResponse.json({ error: `We couldn't send your brief right now. Please email ${site.email}.` }, { status: 503 });
  }

  let leadId: string | undefined;
  if (db) {
    const [row] = await db.insert(schema.leads).values(record).returning({ id: schema.leads.id });
    leadId = row?.id;
  } else if (process.env.NODE_ENV === "production") {
    console.error("[leads] DATABASE_URL missing — lead sent by email only");
  }

  await Promise.allSettled([
    sendLeadNotification({ ...record, id: leadId }),
    sendLeadAutoReply(d.email, d.fullName, leadId).then(async (sent) => {
      if (sent && db && leadId) {
        await db.insert(schema.leadEvents).values({ leadId, type: "email_sent", payload: { template: "auto_reply" } });
      }
    }),
  ]);

  return NextResponse.json({ ok: true, id: leadId });
}
