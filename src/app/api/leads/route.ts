import { NextResponse, type NextRequest } from "next/server";
import { budgetLabels, leadPayloadSchema, leadSchema, shortLeadSchema, timelineLabels, type LeadInput } from "@/lib/lead-schema";
import { emailConfigured, renderFields, sendMail } from "@/lib/server/email";
import { site } from "@/content/site";
import { getIndustries, getServices } from "@/lib/content";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { clientIp, clientCountry } from "@/lib/server/request";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = await rateLimit(`lead:${ip ?? "anon"}`);
  if (!rl.success) return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });

  const json = await req.json().catch(() => null);
  const payload = leadPayloadSchema.safeParse(json);
  if (!payload.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { variant, data, meta, turnstileToken, website } = payload.data;

  // Honeypot: pretend success so bots learn nothing.
  if (website) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ error: "Verification failed. Please refresh and try again." }, { status: 400 });
  }

  const parsed = variant === "full" ? leadSchema.safeParse(data) : shortLeadSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const d = parsed.data as Partial<LeadInput> & { fullName: string; email: string };

  // Email is the only place a lead goes: never accept one we can't deliver.
  if (!emailConfigured()) {
    console.error("[leads] email not configured (RESEND_API_KEY or SMTP_*) — lead rejected");
    return NextResponse.json(
      { error: `Our contact form is temporarily unavailable. Please email ${site.email} or call ${site.phone}.` },
      { status: 503 },
    );
  }

  // Human-readable labels for the inbox (falls back to the raw slug).
  const [services, industries] = await Promise.all([getServices(), getIndustries()]);
  const label = (list: { slug: string; title: string }[], slug: string) => list.find((x) => x.slug === slug)?.title ?? slug;

  const title = variant === "full" ? "New enquiry (contact form)" : "New enquiry (quick form)";
  try {
    await sendMail({
      subject: `New enquiry — ${d.organisation || d.fullName}`,
      replyTo: d.email,
      ...renderFields(title, [
        ["Name", d.fullName],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Organisation", d.organisation],
        ["Role", d.role],
        ["Services", d.serviceInterest?.map((x) => label(services, x))],
        ["Sector", d.industry && label(industries, d.industry)],
        ["Budget", d.budgetBand && budgetLabels[d.budgetBand]],
        ["Timeline", d.timeline && timelineLabels[d.timeline]],
        ["Message", d.message],
        ["Privacy consent", d.consent],
        ["Marketing consent", d.consentMarketing ?? false],
        ["Country", clientCountry(req)],
        ["Source page", meta.sourcePage],
        ["Referrer", meta.referrer],
        ["UTM source", meta.utmSource],
        ["UTM medium", meta.utmMedium],
        ["UTM campaign", meta.utmCampaign],
        ["Submitted", new Date().toISOString()],
      ]),
    });
  } catch (err) {
    console.error("[leads] sending failed", err);
    return NextResponse.json(
      { error: `We couldn't send your brief right now. Please try again or email ${site.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
