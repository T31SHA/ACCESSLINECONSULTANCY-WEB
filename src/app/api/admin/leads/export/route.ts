import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/auth";
import { getDb, schema } from "@/db";
import { exportLeads, parseFilters, toCsv } from "@/lib/admin/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  const filters = parseFilters(Object.fromEntries(req.nextUrl.searchParams));
  const rows = db ? await exportLeads(db, filters) : [];
  if (db) {
    await db.insert(schema.auditLog).values({ actorId: admin.actorId, action: "export_csv", entity: "lead", diff: { filters, rows: rows.length } });
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(toCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="accessline-leads-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
