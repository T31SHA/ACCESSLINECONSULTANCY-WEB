import "server-only";
import { and, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { z } from "zod";
import { schema, type Db } from "@/db";

export const LEAD_STATUSES = schema.leadStatus.enumValues;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leadFilterSchema = z.object({
  q: z.string().trim().max(120).optional().catch(undefined),
  status: z.enum(LEAD_STATUSES).optional().catch(undefined),
  minScore: z.coerce.number().int().min(0).max(100).optional().catch(undefined),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).default(1).catch(1),
});
export type LeadFilters = z.infer<typeof leadFilterSchema>;

export const parseFilters = (sp: Record<string, string | string[] | undefined>) =>
  leadFilterSchema.parse(Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || undefined])));

function where(f: LeadFilters): SQL | undefined {
  const l = schema.leads;
  const conds: (SQL | undefined)[] = [];
  if (f.q) {
    const like = `%${f.q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
    conds.push(or(ilike(l.fullName, like), ilike(l.email, like), ilike(l.organisation, like)));
  }
  if (f.status) conds.push(eq(l.status, f.status));
  if (f.minScore !== undefined) conds.push(gte(l.score, f.minScore));
  if (f.from) conds.push(gte(l.createdAt, new Date(`${f.from}T00:00:00+03:00`)));
  if (f.to) conds.push(lte(l.createdAt, new Date(`${f.to}T23:59:59.999+03:00`)));
  return conds.length ? and(...conds) : undefined;
}

export const PAGE_SIZE = 25;

export async function listLeads(db: Db, f: LeadFilters) {
  const w = where(f);
  const [rows, [total]] = await Promise.all([
    db.select().from(schema.leads).where(w).orderBy(desc(schema.leads.createdAt)).limit(PAGE_SIZE).offset((f.page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.leads).where(w),
  ]);
  return { rows, total: Number(total?.n ?? 0) };
}

export async function exportLeads(db: Db, f: LeadFilters) {
  return db.select().from(schema.leads).where(where(f)).orderBy(desc(schema.leads.createdAt)).limit(50_000);
}

const CSV_COLUMNS = [
  "id", "createdAt", "status", "score", "fullName", "email", "phone", "organisation", "role", "country", "serviceInterest",
  "industry", "budgetBand", "timeline", "message", "sourcePage", "utmSource", "utmMedium", "utmCampaign", "referrer",
  "consentMarketing", "consentAt",
] as const;

/** RFC 4180 CSV with spreadsheet formula-injection protection. */
export function toCsv(rows: Record<string, unknown>[]) {
  const cell = (v: unknown) => {
    let s = v instanceof Date ? v.toISOString() : Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [CSV_COLUMNS.join(","), ...rows.map((r) => CSV_COLUMNS.map((c) => cell(r[c])).join(","))];
  return `﻿${lines.join("\r\n")}\r\n`;
}
