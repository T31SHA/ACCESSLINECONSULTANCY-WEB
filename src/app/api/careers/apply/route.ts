import { NextResponse, type NextRequest } from "next/server";
import { getJob } from "@/lib/content";
import { site } from "@/content/site";
import { applicationSchema, CV_MAX_BYTES, CV_TYPES } from "@/lib/careers-schema";
import { emailConfigured, notifyInbox, type Attachment } from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const runtime = "nodejs";

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : undefined);

/** Job application (multipart/form-data) → email to LEADS_INBOX with the CV attached (optional). No database. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
  if (!(await rateLimit(`apply:${ip ?? "anon"}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const parsed = applicationSchema.safeParse({
    jobSlug: str(form.get("jobSlug")),
    fullName: str(form.get("fullName")),
    email: str(form.get("email")),
    phone: str(form.get("phone")),
    linkedinUrl: str(form.get("linkedinUrl")),
    coverNote: str(form.get("coverNote")),
    turnstileToken: str(form.get("turnstileToken")),
    website: str(form.get("website")),
  });
  if (!parsed.success) return NextResponse.json({ error: "Please check your details.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  const { turnstileToken, website, ...d } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // honeypot

  const job = await getJob(d.jobSlug);
  if (!job) return NextResponse.json({ error: "Invalid application." }, { status: 400 });
  if (!(await verifyTurnstile(turnstileToken, ip))) return NextResponse.json({ error: "Verification failed." }, { status: 400 });

  const cv = form.get("cv");
  const attachments: Attachment[] = [];
  if (cv instanceof File && cv.size > 0) {
    if (!(cv.type in CV_TYPES)) return NextResponse.json({ error: "CV must be a PDF or DOCX file." }, { status: 422 });
    if (cv.size > CV_MAX_BYTES) return NextResponse.json({ error: "CV must be 5MB or smaller." }, { status: 422 });
    const ext = CV_TYPES[cv.type as keyof typeof CV_TYPES];
    const safeName = d.fullName.replace(/[^\w-]+/g, "-").slice(0, 60) || "applicant";
    attachments.push({ filename: `CV-${safeName}.${ext}`, content: Buffer.from(await cv.arrayBuffer()), contentType: cv.type });
  }

  if (!emailConfigured()) {
    console.error("[careers] email is not configured — application rejected");
    return NextResponse.json({ error: `Applications are temporarily unavailable. Please email ${site.email}.` }, { status: 503 });
  }

  const sent = await notifyInbox(
    `Job application — ${job.title} — ${d.fullName}`,
    `Application: ${job.title}`,
    { Role: job.title, "Full name": d.fullName, Email: d.email, Phone: d.phone, LinkedIn: d.linkedinUrl, "Cover note": d.coverNote, CV: attachments[0]?.filename ?? "not attached", "Submitted at": new Date() },
    d.email,
    attachments,
  );
  if (!sent) return NextResponse.json({ error: `We couldn't send your application. Please email ${site.email}.` }, { status: 502 });
  return NextResponse.json({ ok: true });
}
