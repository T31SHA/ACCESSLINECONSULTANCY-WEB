import Link from "next/link";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { requireAdmin } from "@/auth";
import { getDb } from "@/db";
import { LEAD_STATUSES, listLeads, PAGE_SIZE, parseFilters } from "@/lib/admin/leads";
import { AdminHeader } from "./admin-header";
import { StatusBadge } from "./status-badge";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const fmt = new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" });
const field = "min-h-11 rounded-md border border-[var(--line)] bg-[var(--surface-raised)] px-3 text-sm";

export default async function AdminLeadsPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const filters = parseFilters(await searchParams);
  const db = await getDb();
  const { rows, total } = db ? await listLeads(db, filters) : { rows: [], total: 0 };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...filters, ...over })) if (v !== undefined && v !== "" && !(k === "page" && v === 1)) p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <AdminHeader email={admin.email} />
      <main id="main" className="container-site py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-h3">Leads</h1>
            <p className="mt-1 text-sm text-[var(--fg-muted)]" aria-live="polite">{total} {total === 1 ? "lead" : "leads"} match</p>
          </div>
          <a href={`/api/admin/leads/export${qs({ page: undefined })}`} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-[var(--line)] px-5 text-sm font-semibold hover:bg-[var(--line)]">
            <Download aria-hidden className="size-4" strokeWidth={1.5} /> Export CSV
          </a>
        </div>

        {!db && (
          <p role="status" className="mt-6 rounded-md border border-[var(--line)] bg-[var(--surface-raised)] p-5 text-sm">
            Database not configured — set <code>DATABASE_URL</code> to see leads.
          </p>
        )}

        <form role="search" aria-label="Filter leads" className="mt-8 grid gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-4 sm:grid-cols-2 lg:grid-cols-6">
          <label className="lg:col-span-2"><span className="sr-only">Search</span>
            <input name="q" type="search" defaultValue={filters.q} placeholder="Search name, email, organisation" className={`${field} w-full`} />
          </label>
          <label><span className="sr-only">Status</span>
            <select name="status" defaultValue={filters.status ?? ""} className={`${field} w-full`}>
              <option value="">All statuses</option>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label><span className="sr-only">Minimum score</span>
            <select name="minScore" defaultValue={filters.minScore ?? ""} className={`${field} w-full`}>
              <option value="">Any score</option>
              {[25, 50, 75].map((n) => <option key={n} value={n}>Score ≥ {n}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><span className="shrink-0 text-[var(--fg-muted)]">From</span>
            <input name="from" type="date" defaultValue={filters.from} className={`${field} w-full`} />
          </label>
          <label className="flex items-center gap-2 text-sm"><span className="shrink-0 text-[var(--fg-muted)]">To</span>
            <input name="to" type="date" defaultValue={filters.to} className={`${field} w-full`} />
          </label>
          <div className="flex gap-2 lg:col-span-6">
            <button type="submit" className="min-h-11 rounded-pill bg-forest-700 px-5 text-sm font-semibold text-sand-50 hover:bg-forest-900">Apply filters</button>
            <Link href="/admin" className="inline-flex min-h-11 items-center rounded-pill px-5 text-sm font-semibold hover:bg-[var(--line)]">Reset</Link>
          </div>
        </form>

        <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface-raised)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Leads, newest first</caption>
            <thead className="border-b border-[var(--line)] text-[var(--fg-muted)]">
              <tr>
                {["Received", "Name", "Organisation", "Services", "Score", "Status"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-[var(--line)] last:border-0 hover:bg-mint-50">
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--fg-muted)]">{fmt.format(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-semibold underline-offset-4 hover:underline">{l.fullName}</Link>
                    <div className="text-xs text-[var(--fg-muted)]">{l.email}</div>
                  </td>
                  <td className="px-4 py-3">{l.organisation ?? "—"}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[var(--fg-muted)]">{l.serviceInterest.join(", ") || "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{l.score}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--fg-muted)]">No leads match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
            {filters.page > 1 ? <Link href={`/admin${qs({ page: filters.page - 1 })}`} className="min-h-11 rounded-pill px-4 py-2.5 font-semibold hover:bg-[var(--line)]">← Newer</Link> : <span />}
            <span className="text-[var(--fg-muted)]">Page {filters.page} of {pages}</span>
            {filters.page < pages ? <Link href={`/admin${qs({ page: filters.page + 1 })}`} className="min-h-11 rounded-pill px-4 py-2.5 font-semibold hover:bg-[var(--line)]">Older →</Link> : <span />}
          </nav>
        )}
      </main>
    </>
  );
}
