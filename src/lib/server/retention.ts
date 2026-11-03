import "server-only";
import { and, eq, inArray, lt } from "drizzle-orm";
import { schema, type Db } from "@/db";
import { deleteCvObject, r2Configured } from "./r2";

export const RETENTION = { spamLeadDays: 30, applicationMonths: 12 } as const;

/**
 * Implements src/db/retention.sql (Kenya DPA 2019):
 *   spam leads > 30 days → deleted; job applications > 12 months → CV object removed from R2, then row deleted.
 * Applications whose CV can't be removed are kept and retried on the next run.
 */
export async function runRetention(db: Db, now = new Date()) {
  const spamCutoff = new Date(now.getTime() - RETENTION.spamLeadDays * 864e5);
  const appCutoff = new Date(now);
  appCutoff.setMonth(appCutoff.getMonth() - RETENTION.applicationMonths);

  const spam = await db
    .delete(schema.leads)
    .where(and(eq(schema.leads.status, "spam"), lt(schema.leads.createdAt, spamCutoff)))
    .returning({ id: schema.leads.id });

  const expired = await db
    .select({ id: schema.jobApplications.id, key: schema.jobApplications.cvObjectKey })
    .from(schema.jobApplications)
    .where(lt(schema.jobApplications.createdAt, appCutoff));

  const deletable: string[] = [];
  let cvFailures = 0;
  for (const a of expired) {
    if (!r2Configured || (await deleteCvObject(a.key))) deletable.push(a.id);
    else cvFailures++;
  }
  if (deletable.length) await db.delete(schema.jobApplications).where(inArray(schema.jobApplications.id, deletable));

  await db.insert(schema.auditLog).values({
    action: "retention_run",
    entity: "system",
    diff: { spamLeadsDeleted: spam.length, applicationsDeleted: deletable.length, cvFailures, r2Configured },
  });
  return { spamLeadsDeleted: spam.length, applicationsDeleted: deletable.length, cvFailures };
}
