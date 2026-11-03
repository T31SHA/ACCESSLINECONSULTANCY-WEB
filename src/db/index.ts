import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

const url = process.env.DATABASE_URL ?? "";
const g = globalThis as unknown as { __alcDb?: Promise<Db | null> };

/**
 * Database handle, or null when DATABASE_URL is unset (every caller degrades gracefully).
 * - postgres(ql):// → Neon serverless HTTP driver (production)
 * - pglite://<dir> or pglite://memory → in-process PGlite for local dev & E2E tests; auto-migrates
 */
export function getDb(): Promise<Db | null> {
  g.__alcDb ??= init();
  return g.__alcDb;
}

async function init(): Promise<Db | null> {
  if (!url) return null;
  if (url.startsWith("pglite://")) {
    const [{ PGlite }, { citext }, { drizzle: drizzlePglite }, { migrate }, path] = await Promise.all([
      import("@electric-sql/pglite"),
      import("@electric-sql/pglite/contrib/citext"),
      import("drizzle-orm/pglite"),
      import("drizzle-orm/pglite/migrator"),
      import("node:path"),
    ]);
    const dir = url.slice("pglite://".length);
    const client = new PGlite(dir === "memory" ? undefined : path.resolve(dir), { extensions: { citext } });
    const db = drizzlePglite(client, { schema });
    await migrate(db, { migrationsFolder: path.resolve("drizzle") });
    return db as unknown as Db; // query-builder API is identical for our usage
  }
  return drizzle(neon(url), { schema });
}

export { schema };
