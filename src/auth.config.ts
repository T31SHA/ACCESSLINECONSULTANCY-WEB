import type { NextAuthConfig } from "next-auth";

/** Comma-separated allowlist; only these emails may access /admin. */
export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

export const isAdminEmail = (email?: string | null) => !!email && adminEmails().includes(email.toLowerCase());

/** Edge-safe config shared by middleware and the full Node config in auth.ts. */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/admin/login") return true;
      if (isAdminEmail(auth?.user?.email)) return true;
      if (pathname.startsWith("/api/admin")) return Response.json({ error: "Unauthorized" }, { status: 401 });
      return false; // → redirect to /admin/login?callbackUrl=…
    },
  },
} satisfies NextAuthConfig;
