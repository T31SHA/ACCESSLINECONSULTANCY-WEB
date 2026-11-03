import Link from "next/link";
import { site } from "@/content/site";
import { LinkedInIcon } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Logo } from "./logo";

const company = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Team", href: "/team" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

type Props = { services: { slug: string; title: string }[]; industryCount: number; socials: Partial<Record<string, string>> };

export function Footer({ services, industryCount, socials }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-dark relative overflow-hidden bg-[var(--surface)] text-[var(--fg)]">
      <div className="container-site pt-20 pb-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="text-sand-50" aria-label={`${site.name} — home`}><Logo /></Link>
            <p className="mt-6 max-w-sm font-display text-h3 font-bold">{site.tagline}</p>
            <p className="mt-4 max-w-sm text-[var(--fg-muted)]">{site.positioning}</p>
            <div className="mt-8 max-w-sm">
              <h2 className="eyebrow mb-3 font-sans text-[var(--fg-muted)]">Insights, monthly</h2>
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label="Services" className="md:col-span-3">
            <h2 className="eyebrow mb-5 font-sans text-[var(--fg-muted)]">Services</h2>
            <ul className="space-y-2.5 text-[0.9375rem]">
              {services.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`} className="hover:text-mint-200">{s.title}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company" className="md:col-span-2">
            <h2 className="eyebrow mb-5 font-sans text-[var(--fg-muted)]">Company</h2>
            <ul className="space-y-2.5 text-[0.9375rem]">
              {company.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-mint-200">{l.label}</Link></li>
              ))}
              <li><Link href="/industries" className="hover:text-mint-200">Industries ({industryCount})</Link></li>
            </ul>
          </nav>
          <div className="md:col-span-2">
            <h2 className="eyebrow mb-5 font-sans text-[var(--fg-muted)]">Visit</h2>
            <address className="space-y-2.5 text-[0.9375rem] not-italic">
              <p>{site.address.street}<br />{site.address.locality}, {site.address.countryName}</p>
              <p><a href={`mailto:${site.email}`} className="hover:text-mint-200">{site.email}</a></p>
              <p><a href={site.phoneHref} className="hover:text-mint-200">{site.phone}</a></p>
            </address>
            {socials.linkedin && (
              <a href={socials.linkedin} className="mt-6 inline-flex size-11 items-center justify-center rounded-pill border border-[var(--line)] hover:bg-[var(--line)]" aria-label={`${site.name} on LinkedIn`} rel="noopener" target="_blank">
                <LinkedInIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Decorative wordmark rendered via CSS content: invisible to assistive tech */}
        <div aria-hidden className="pointer-events-none mt-20 select-none font-display text-[clamp(4rem,16vw,15rem)] font-bold leading-[0.8] tracking-tighter text-[var(--line)] before:content-['accessline']" />

        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--line)] pt-6 text-sm text-[var(--fg-muted)] md:flex-row md:justify-between">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <ul className="flex gap-6">
            <li><Link href="/privacy" className="hover:text-[var(--fg)]">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--fg)]">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
