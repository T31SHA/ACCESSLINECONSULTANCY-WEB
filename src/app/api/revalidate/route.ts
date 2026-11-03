import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const runtime = "nodejs";

type Payload = { _type?: string; slug?: string };

/**
 * Sanity GROQ-powered webhook → on-demand ISR.
 * Configure in sanity.io/manage: POST https://<site>/api/revalidate, projection `{_type, "slug": slug.current}`,
 * secret = SANITY_REVALIDATE_SECRET. The signature header is verified before anything is purged.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "Revalidation is not configured." }, { status: 503 });

  const { isValidSignature, body } = await parseBody<Payload>(req, secret);
  if (!isValidSignature) return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  if (!body?._type) return NextResponse.json({ error: "Missing _type." }, { status: 400 });

  revalidateTag(body._type);
  revalidateTag("sanity");
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, type: body._type, slug: body.slug ?? null, now: Date.now() });
}
