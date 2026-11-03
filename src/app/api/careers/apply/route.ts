import { NextResponse, type NextRequest } from "next/server";
import { getJob } from "@/lib/content";
import { getDb, schema } from "@/db";
import { site } from "@/content/site";
import { applicationSchema } from "@/lib/careers-schema";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const db = await getDb();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
  if (!(await rateLimit(`apply:${ip ?? "anon"}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = applicationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details.", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  const { turnstileToken, ...d } = parsed.data;
  if (!(await getJob(d.jobSlug)) || !d.cvObjectKey.startsWith(`cvs/${d.jobSlug}/`)) return NextResponse.json({ error: "Invalid application." }, { status: 400 });
  if (!(await verifyTurnstile(turnstileToken, ip))) return NextResponse.json({ error: "Verification failed." }, { status: 400 });
  if (!db) {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: `Applications are temporarily unavailable. Please email ${site.email}.` }, { status: 503 });
    return NextResponse.json({ ok: true });
  }
  await db.insert(schema.jobApplications).values({ ...d, phone: d.phone || null, linkedinUrl: d.linkedinUrl || null });
  return NextResponse.json({ ok: true });
}
