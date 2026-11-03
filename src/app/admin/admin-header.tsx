import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { logout } from "./actions";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface-raised)]">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/admin" className="flex items-center gap-3 text-forest-700">
          <Logo className="text-lg" /><span className="eyebrow text-[var(--fg-muted)]">Leads</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-[var(--fg-muted)] sm:inline">{email}</span>
          <form action={logout}>
            <button type="submit" className="min-h-11 rounded-pill border border-[var(--line)] px-4 font-semibold hover:bg-[var(--line)]">Sign out</button>
          </form>
        </div>
      </div>
    </header>
  );
}
