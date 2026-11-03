import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Admin | Accessline" }, robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[var(--surface)] text-[var(--fg)]">{children}</div>;
}
