import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Logo } from "@/components/layout/logo";

type Props = { searchParams: Promise<{ error?: string; callbackUrl?: string }> };

/** Only ever redirect to a same-site /admin path (strips any origin from absolute callback URLs). */
function safeCallback(url?: string) {
  if (!url) return "/admin";
  try {
    const u = new URL(url, "http://local");
    return u.pathname.startsWith("/admin") && !u.pathname.startsWith("/admin/login") ? `${u.pathname}${u.search}` : "/admin";
  } catch {
    return "/admin";
  }
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, callbackUrl } = await searchParams;
  const configured = Boolean(process.env.AUTH_SECRET && process.env.ADMIN_EMAILS && (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD));

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: safeCallback(String(formData.get("callbackUrl") ?? "")),
      });
    } catch (e) {
      if (e instanceof AuthError) redirect(`/admin/login?error=1&callbackUrl=${encodeURIComponent(safeCallback(String(formData.get("callbackUrl") ?? "")))}`);
      throw e;
    }
  }

  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-forest-700"><Logo /></div>
        <h1 className="text-h3">Sign in to leads</h1>
        {!configured ? (
          <p role="status" className="mt-6 rounded-md border border-[var(--line)] bg-[var(--surface-raised)] p-5 text-sm text-[var(--fg-muted)]">
            Admin isn&apos;t configured. Set <code>AUTH_SECRET</code>, <code>ADMIN_EMAILS</code> and <code>ADMIN_PASSWORD_HASH</code>, then redeploy.
          </p>
        ) : (
          <form action={login} className="mt-8 space-y-5">
            <input type="hidden" name="callbackUrl" value={safeCallback(callbackUrl)} />
            {error && <p role="alert" className="rounded-md bg-[#FEF3F2] p-4 text-sm font-medium text-[#7A271A]">Incorrect email or password, or too many attempts.</p>}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold">Email</label>
              <input id="email" name="email" type="email" required autoComplete="username" className="block min-h-12 w-full rounded-md border border-[var(--line)] bg-[var(--surface-raised)] px-4" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold">Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className="block min-h-12 w-full rounded-md border border-[var(--line)] bg-[var(--surface-raised)] px-4" />
            </div>
            <button type="submit" className="min-h-12 w-full rounded-pill bg-forest-700 font-semibold text-sand-50 hover:bg-forest-900">Sign in</button>
          </form>
        )}
      </div>
    </main>
  );
}
