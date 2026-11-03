import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

/** Cal.com signs the raw body: X-Cal-Signature-256 = hex(HMAC-SHA256(secret, body)). */
export function verifyCalSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature.trim(), "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export const calEventSchema = z.object({
  triggerEvent: z.string(),
  payload: z.object({
    uid: z.string().min(1),
    startTime: z.string(),
    endTime: z.string(),
    rescheduleUid: z.string().nullish(),
    attendees: z.array(z.object({ email: z.string(), name: z.string().optional() })).default([]),
    metadata: z.record(z.string(), z.unknown()).nullish(),
    status: z.string().optional(),
  }).loose(),
}).loose();

export type CalEvent = z.infer<typeof calEventSchema>;

/** Booking link pre-filled for a lead; metadata[leadId] comes back in the webhook to link the booking. */
export function calLinkForLead(calUrl: string, lead: { id?: string; name: string; email: string }) {
  const u = new URL(calUrl);
  u.searchParams.set("name", lead.name);
  u.searchParams.set("email", lead.email);
  if (lead.id) u.searchParams.set("metadata[leadId]", lead.id);
  return u.toString();
}
