import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-site section relative overflow-hidden">
      <div aria-hidden className="topo pointer-events-none absolute -right-40 top-0 h-[640px] w-[900px] opacity-[0.08]" />
      <p className="eyebrow text-[var(--fg-muted)]">404</p>
      <h1 className="relative mt-6 max-w-[14ch] text-display">This line doesn&apos;t lead anywhere.</h1>
      <p className="mt-8 max-w-[48ch] text-lg text-[var(--fg-muted)]">The page may have moved when we rebuilt the site. Try one of these instead.</p>
      <div className="relative mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/" withArrow>Home</ButtonLink>
        <ButtonLink href="/services" variant="outline">Services</ButtonLink>
        <ButtonLink href="/contact" variant="ghost">Contact</ButtonLink>
      </div>
    </section>
  );
}
