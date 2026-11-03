import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getJob } from "@/content/people";
import { CV_MAX_BYTES as MAX, CV_TYPES } from "@/lib/careers-schema";
import { rateLimit } from "@/lib/server/rate-limit";
import { presignCvUpload, r2Configured } from "@/lib/server/r2";

export const runtime = "nodejs";


const body = z.object({
  jobSlug: z.string(),
  contentType: z.enum(Object.keys(CV_TYPES) as [keyof typeof CV_TYPES]),
  size: z.number().int().positive().max(MAX, "CV must be 5MB or smaller"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  if (!(await rateLimit(`cv:${ip}`)).success) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Upload a PDF or DOCX up to 5MB." }, { status: 422 });
  if (!getJob(parsed.data.jobSlug)) return NextResponse.json({ error: "Unknown role." }, { status: 404 });
  if (!r2Configured) return NextResponse.json({ error: "Uploads are temporarily unavailable." }, { status: 503 });

  const key = `cvs/${parsed.data.jobSlug}/${randomUUID()}.${CV_TYPES[parsed.data.contentType]}`;
  const url = await presignCvUpload(key, parsed.data.contentType);
  return NextResponse.json({ url, key });
}
