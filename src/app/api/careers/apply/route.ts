import { NextResponse, type NextRequest } from "next/server";
import { getJob } from "@/lib/content";
import { site } from "@/content/site";
import { applicationSchema, checkCvFile, CV_MAX_BYTES } from "@/lib/careers-schema";
import { emailConfigured, renderFields, sendMail, type MailAttachment } from "@/lib/server/email";
import { rateLimit } from "@/lib/server/rate-limit";
import { clientIp } from "@/lib/server/request";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const runtime = "nodejs";

/** CV + text fields + multipart overhead. */
const MAX_BODY = CV_MAX_BYTES + 256 * 1024;

const MAGIC = { pdf: [0x25, 0x50, 0x44, 0x46], docx: [0x50, 0x4b, 0x03, 0x04] } as const; // "%PDF", "PK\3\4"
const hasMagic = (buf: Buffer, ext: keyof typeof MAGIC) => MAGIC[ext].every((b, i) => buf[i] === b);

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : undefined);

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!(await rateLimit(`apply:${ip ?? "anon"}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) {
    return NextResponse.json({ error: "CV must be 5MB or smaller." }, { status: 413 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const parsed = applicationSchema.safeParse({
    jobSlug: str(form.get("jobSlug")),
    fullName: str(form.get("fullName")),
    email: str(form.get("email")),
    phone: str(form.get("phone")),
    linkedinUrl: str(form.get("linkedinUrl")),
    coverNote: str(form.get("coverNote")) || undefined,
    turnstileToken: str(form.get("turnstileToken")),
    website: str(form.get("website")) || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const { turnstileToken, website, ...d } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // honeypot

  const job = await getJob(d.jobSlug);
  if (!job) return NextResponse.json({ error: "Invalid application." }, { status: 400 });
  if (!(await verifyTurnstile(turnstileToken, ip))) return NextResponse.json({ error: "Verification failed." }, { status: 400 });

  // Optional CV attachment.
  const attachments: MailAttachment[] = [];
  const cv = form.get("cv");
  if (cv && typeof cv !== "string" && cv.size > 0) {
    const check = checkCvFile(cv);
    if (!check.ok) return NextResponse.json({ error: check.error, fieldErrors: { cv: [check.error] } }, { status: 422 });
    const content = Buffer.from(await cv.arrayBuffer());
    if (!hasMagic(content, check.ext)) {
      const error = "CV must be a PDF or DOCX file.";
      return NextResponse.json({ error, fieldErrors: { cv: [error] } }, { status: 422 });
    }
    const safeName = d.fullName.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60) || "applicant";
    attachments.push({ filename: `CV-${safeName}.${check.ext}`, content, contentType: check.contentType });
  }

  if (!emailConfigured()) {
    console.error("[careers] email not configured (RESEND_API_KEY or SMTP_*) — application rejected");
    return NextResponse.json({ error: `Applications are temporarily unavailable. Please email your CV to ${site.email}.` }, { status: 503 });
  }

  try {
    await sendMail({
      subject: `Job application — ${job.title} — ${d.fullName}`,
      replyTo: d.email,
      attachments,
      ...renderFields(`New application: ${job.title}`, [
        ["Role", job.title],
        ["Name", d.fullName],
        ["Email", d.email],
        ["Phone", d.phone],
        ["LinkedIn", d.linkedinUrl],
        ["Cover note", d.coverNote],
        ["CV", attachments[0] ? `attached (${attachments[0].filename})` : "not provided"],
        ["Submitted", new Date().toISOString()],
      ]),
    });
  } catch (err) {
    console.error("[careers] sending failed", err);
    return NextResponse.json({ error: `We couldn't send your application right now. Please try again or email ${site.email}.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
