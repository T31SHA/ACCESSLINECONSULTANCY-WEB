import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/** Without AUTH_SECRET the admin is disabled (not crashed): pages show the login notice, APIs return 503. */
function adminDisabled(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/admin")) return NextResponse.json({ error: "Admin is not configured." }, { status: 503 });
  if (pathname === "/admin/login") return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export default process.env.AUTH_SECRET ? auth : adminDisabled;

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
