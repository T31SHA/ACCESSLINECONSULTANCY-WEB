import { and, desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { calEventSchema, verifyCalSignature } from "@/lib/integrations/cal";

export const runtime = "nodejs";

const STATUS: Record<string, "scheduled" | "rescheduled" | "cancelled" | "completed"> = {
  BOOKING_CREATED: "scheduled",
  BOOKING_RESCHEDULED: "scheduled",
  BOOKING_CANCELLED: "cancelled",
  MEETING_ENDED: "completed",
};

/**
 * Cal.com webhook → bookings table, linked to the matching lead
 * (metadata.leadId from our pre-filled link, else the newest lead with the attendee's email).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Cal.com webhook is not configured." }, { status: 503 });

  const raw = await req.text();
  if (!verifyCalSignature(raw, req.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event;
  try {
    event = calEventSchema.parse(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
  if (event.triggerEvent === "PING") return NextResponse.json({ ok: true });
  const status = STATUS[event.triggerEvent];
  if (!status) return NextResponse.json({ ok: true, ignored: event.triggerEvent });

  const db = await getDb();
  if (!db) return NextResponse.json({ ok: true, persisted: false });

  const p = event.payload;
  const attendeeEmail = p.attendees[0]?.email?.toLowerCase() ?? "";
  const metaLeadId = z.uuid().safeParse(p.metadata?.leadId).data;

  let leadId: string | null = null;
  if (metaLeadId) {
    const [l] = await db.select({ id: schema.leads.id }).from(schema.leads).where(eq(schema.leads.id, metaLeadId)).limit(1);
    leadId = l?.id ?? null;
  }
  if (!leadId && attendeeEmail) {
    const [l] = await db.select({ id: schema.leads.id }).from(schema.leads).where(eq(schema.leads.email, attendeeEmail)).orderBy(desc(schema.leads.createdAt)).limit(1);
    leadId = l?.id ?? null;
  }

  // A reschedule creates a new uid; mark the original booking as rescheduled.
  if (event.triggerEvent === "BOOKING_RESCHEDULED" && p.rescheduleUid) {
    await db.update(schema.bookings).set({ status: "rescheduled" }).where(eq(schema.bookings.providerEventId, p.rescheduleUid));
  }

  const values = {
    leadId,
    providerEventId: p.uid,
    startsAt: new Date(p.startTime),
    endsAt: new Date(p.endTime),
    attendeeEmail: attendeeEmail || "unknown@invalid",
    status,
  };
  const [booking] = await db
    .insert(schema.bookings)
    .values(values)
    .onConflictDoUpdate({ target: schema.bookings.providerEventId, set: { status, startsAt: values.startsAt, endsAt: values.endsAt, ...(leadId ? { leadId } : {}) } })
    .returning({ id: schema.bookings.id });

  if (leadId && (event.triggerEvent === "BOOKING_CREATED" || event.triggerEvent === "BOOKING_RESCHEDULED")) {
    await db.insert(schema.leadEvents).values({ leadId, type: "call_booked", payload: { bookingId: booking?.id, startsAt: p.startTime, trigger: event.triggerEvent } });
    // Booking a call implies contact has happened; never downgrade later stages.
    await db.update(schema.leads).set({ status: "contacted" }).where(and(eq(schema.leads.id, leadId), eq(schema.leads.status, "new")));
  }

  return NextResponse.json({ ok: true, bookingId: booking?.id, leadId });
}
