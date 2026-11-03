import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** Returns null when DATABASE_URL is unset (local dev without a DB). */
export const db = process.env.DATABASE_URL ? drizzle(neon(process.env.DATABASE_URL), { schema }) : null;
export { schema };
