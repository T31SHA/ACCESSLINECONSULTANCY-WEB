"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, signOut } from "@/auth";
import { getDb, schema } from "@/db";
import { LEAD_STATUSES } from "@/lib/admin/leads";

const uuid = z.uuid();

export async function updateLeadStatus(formData: FormData) {
  const admin = await requireAdmin();
  const db = await getDb();
  if (!admin || !db) return;
  const id = uuid.parse(formData.get("id"));
  const status = z.enum(LEAD_STATUSES).parse(formData.get("status"));
  const [before] = await db.select({ status: schema.leads.status }).from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
  if (!before || before.status === status) return;
  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
  await db.insert(schema.leadEvents).values({ leadId: id, type: "status_change", actorId: admin.actorId, payload: { from: before.status, to: status, by: admin.email } });
  await db.insert(schema.auditLog).values({ actorId: admin.actorId, action: "update_status", entity: "lead", entityId: id, diff: { status: [before.status, status] } });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function addLeadNote(formData: FormData) {
  const admin = await requireAdmin();
  const db = await getDb();
  if (!admin || !db) return;
  const id = uuid.parse(formData.get("id"));
  const note = z.string().trim().min(1).max(4000).parse(formData.get("note"));
  await db.insert(schema.leadEvents).values({ leadId: id, type: "note", actorId: admin.actorId, payload: { note, by: admin.email } });
  await db.insert(schema.auditLog).values({ actorId: admin.actorId, action: "add_note", entity: "lead", entityId: id });
  revalidatePath(`/admin/leads/${id}`);
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
