import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const TOKEN_TTL_DAYS = 14;
const fresh = () => new Date(Date.now() - TOKEN_TTL_DAYS * 864e5);

export async function findPendingByToken(token: string) {
  const db = await getDb();
  if (!db || !/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const s = schema.newsletterSubscribers;
  const [row] = await db.select().from(s).where(and(eq(s.confirmToken, token), eq(s.status, "pending"), gt(s.createdAt, fresh()))).limit(1);
  return row ?? null;
}

/** Confirms and burns the token (single use). Returns true if a pending subscriber was confirmed. */
export async function confirmSubscription(token: string) {
  const db = await getDb();
  const row = await findPendingByToken(token);
  if (!db || !row) return false;
  await db.update(schema.newsletterSubscribers).set({ status: "confirmed", confirmedAt: new Date(), confirmToken: null }).where(eq(schema.newsletterSubscribers.id, row.id));
  return true;
}
