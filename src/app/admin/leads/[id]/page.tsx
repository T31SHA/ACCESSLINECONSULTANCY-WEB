import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/auth";
import { getDb, schema } from "@/db";
import { LEAD_STATUSES } from "@/lib/admin/leads";
import { getIndustries, getServices } from "@/lib/content";
import { budgetLabels, timelineLabels } from "@/lib/lead-schema";
import { addLeadNote, updateLeadStatus } from "../../actions";
import { AdminHeader } from "../../admin-header";
import { StatusBadge } from "../../status-badge";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" });

const eventLabel = (type: string, payload: Record<string, unknown>) => {
  switch (type) {
    case "status_change": return `Status ${payload.from} → ${payload.to}`;
    case "note": return String(payload.note ?? "");
    case "email_sent": return `Email sent (${payload.template ?? "email"})`;
    case "call_booked": return `Call booked${payload.startsAt ? ` for ${fmt.format(new Date(String(payload.startsAt)))}` : ""}`;
    default: return type;
  }
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const db = await getDb();
  if (!db) notFound();

  const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
  if (!lead) notFound();
  const [events, bookings, services, industries] = await Promise.all([
    db.select().from(schema.leadEvents).where(eq(schema.leadEvents.leadId, id)).orderBy(desc(schema.leadEvents.createdAt)),
    db.select().from(schema.bookings).where(eq(schema.bookings.leadId, id)).orderBy(desc(schema.bookings.startsAt)),
    getServices(),
    getIndustries(),
  ]);
  const serviceTitle = (s: string) => services.find((x) => x.slug === s)?.title ?? s;

  const details: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${lead.email}`} className="underline">{lead.email}</a>],
    ["Phone", lead.phone ? <a key="p" href={`tel:${lead.phone.replace(/\s/g, "")}`} className="underline">{lead.phone}</a> : "—"],
    ["Organisation", lead.organisation ?? "—"],
    ["Role", lead.role ?? "—"],
    ["Sector", (lead.industry && industries.find((i) => i.slug === lead.industry)?.title) ?? lead.industry ?? "—"],
    ["Services", lead.serviceInterest.map(serviceTitle).join(", ") || "—"],
    ["Budget", lead.budgetBand ? budgetLabels[lead.budgetBand] : "—"],
    ["Timeline", lead.timeline ? timelineLabels[lead.timeline] : "—"],
    ["Country", lead.country ?? "—"],
    ["Source", [lead.sourcePage, lead.utmSource && `utm: ${lead.utmSource}/${lead.utmMedium ?? ""}/${lead.utmCampaign ?? ""}`].filter(Boolean).join(" · ") || "—"],
    ["Marketing consent", lead.consentMarketing ? "Yes" : "No"],
  ];

  return (
    <>
      <AdminHeader email={admin.email} />
      <main id="main" className="container-site py-10">
        <Link href="/admin" className="text-sm text-[var(--fg-muted)] underline-offset-4 hover:underline">← All leads</Link>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <h1 className="text-h3">{lead.fullName}</h1>
          <StatusBadge status={lead.status} />
          <span className="text-sm text-[var(--fg-muted)]">Score {lead.score} · received {fmt.format(lead.createdAt)}</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <section aria-labelledby="details" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 lg:col-span-7">
            <h2 id="details" className="text-xl">Details</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[160px_1fr]">
              {details.map(([k, v]) => (
                <div key={k} className="contents"><dt className="text-[var(--fg-muted)]">{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            {lead.message && (
              <>
                <h3 className="mt-6 text-base">Message</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm">{lead.message}</p>
              </>
            )}
            {bookings.length > 0 && (
              <>
                <h3 className="mt-6 text-base">Bookings</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {bookings.map((b) => <li key={b.id}>{fmt.format(b.startsAt)} · <span className="capitalize">{b.status}</span></li>)}
                </ul>
              </>
            )}
          </section>

          <div className="space-y-8 lg:col-span-5">
            <section aria-labelledby="status" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6">
              <h2 id="status" className="text-xl">Status</h2>
              <form action={updateLeadStatus} className="mt-4 flex gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <label className="flex-1"><span className="sr-only">Lead status</span>
                  <select key={lead.status} name="status" defaultValue={lead.status} className="min-h-11 w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 capitalize">
                    {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <button type="submit" className="min-h-11 rounded-pill bg-forest-700 px-5 text-sm font-semibold text-sand-50 hover:bg-forest-900">Update</button>
              </form>
            </section>

            <section aria-labelledby="notes" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6">
              <h2 id="notes" className="text-xl">Notes & activity</h2>
              <form action={addLeadNote} className="mt-4 space-y-2">
                <input type="hidden" name="id" value={lead.id} />
                <label htmlFor="note" className="sr-only">Add a note</label>
                <textarea id="note" name="note" required rows={3} placeholder="Add a note…" className="block w-full rounded-md border border-[var(--line)] bg-[var(--surface)] p-3 text-sm" />
                <button type="submit" className="min-h-11 rounded-pill border border-[var(--line)] px-5 text-sm font-semibold hover:bg-[var(--line)]">Add note</button>
              </form>
              <ol className="mt-6 space-y-4 border-l border-[var(--line)] pl-4 text-sm">
                {events.map((e) => {
                  const payload = (e.payload ?? {}) as Record<string, unknown>;
                  return (
                    <li key={e.id}>
                      <p className={e.type === "note" ? "whitespace-pre-wrap" : "font-medium"}>{eventLabel(e.type, payload)}</p>
                      <p className="mt-0.5 text-xs text-[var(--fg-muted)]">{fmt.format(e.createdAt)}{payload.by ? ` · ${String(payload.by)}` : ""}</p>
                    </li>
                  );
                })}
                {events.length === 0 && <li className="text-[var(--fg-muted)]">No activity yet.</li>}
              </ol>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
