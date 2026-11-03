import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { verifyAdminPassword } from "@/lib/server/password";
import { rateLimit } from "@/lib/server/rate-limit";
import { authConfig, isAdminEmail } from "./auth.config";

const credentials = z.object({ email: z.email().max(254), password: z.string().min(1).max(200) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(raw) {
        const parsed = credentials.safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        if (!(await rateLimit(`login:${email}`)).success) return null;
        if (!isAdminEmail(email) || !(await verifyAdminPassword(parsed.data.password))) return null;

        // Mirror admins into `users` so actions can be attributed in lead_events / audit_log.
        const db = await getDb();
        if (db) {
          const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
          const user = existing ?? (await db.insert(schema.users).values({ email, name: email.split("@")[0]!, role: "admin" }).returning())[0];
          if (user) return { id: user.id, email: user.email, name: user.name, role: user.role };
        }
        return { id: email, email, name: email.split("@")[0], role: "admin" };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.uid ?? "");
      (session.user as { role?: string }).role = String(token.role ?? "admin");
      return session;
    },
  },
});

/** Server-side guard for admin actions and route handlers (defence in depth beyond middleware). */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) return null;
  const id = session.user.id;
  const actorId = id && /^[0-9a-f-]{36}$/.test(id) ? id : null;
  return { email: session.user.email, actorId };
}
