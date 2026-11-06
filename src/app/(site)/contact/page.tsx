import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { MapEmbed } from "@/components/blocks/map-embed";
import { PageHero } from "@/components/blocks/page-hero";
import { WhatsAppLink } from "@/components/blocks/whatsapp-link";
import { LeadForm } from "@/components/forms/lead-form";
import { site } from "@/content/site";
import { getIndustries, getServices, getSiteSettings } from "@/lib/content";
import { Photo } from "@/components/ui/photo";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us | Start a Project",
  description: "Brief Accessline Consultancy Limited on your PR, communications or research project. 10th Floor, Ecobank Towers, Nairobi.",
  path: "/contact",
});

export default async function ContactPage() {
  const [services, industries, { calUrl }] = await Promise.all([getServices(), getIndustries(), getSiteSettings()]);
  const opt = ({ slug, title }: { slug: string; title: string }) => ({ slug, title });
  return (
    <>
      <PageHero crumbs={[{ name: "Contact", path: "/contact" }]} overline="Start a project" title="Tell us the outcome you need." lede="Three short steps. A senior consultant replies personally." />
      <div className="container-site grid gap-10 pb-[var(--section-y)] lg:grid-cols-12 lg:gap-12">
        <section aria-label="Project brief" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 md:p-10 lg:col-span-7">
          <LeadForm services={services.map(opt)} industries={industries.map(opt)} />
        </section>
        <aside aria-label="Other ways to reach us" className="space-y-4 lg:col-span-5">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 md:p-8">
            <p className="readout text-[var(--fg-muted)]">Direct lines</p>
            <ul className="mt-4 divide-y divide-[var(--line)]">
              <li className="flex gap-4 py-4">
                <MapPin aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-forest-500" />
                <div><p className="readout text-[var(--fg-muted)]">Office</p><address className="mt-1 not-italic">{site.address.street}<br />{site.address.locality}, {site.address.countryName}</address></div>
              </li>
              <li className="flex gap-4 py-4">
                <Mail aria-hidden strokeWidth={1.5} className="mt-3 size-5 shrink-0 text-forest-500" />
                <div><p className="readout text-[var(--fg-muted)]">Email</p><a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center font-semibold [overflow-wrap:anywhere] underline-offset-4 hover:underline">{site.email}</a></div>
              </li>
              <li className="flex gap-4 pt-4">
                <Phone aria-hidden strokeWidth={1.5} className="mt-3 size-5 shrink-0 text-forest-500" />
                <div><p className="readout text-[var(--fg-muted)]">Phone</p><a href={site.phoneHref} className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">{site.phone}</a></div>
              </li>
            </ul>
          </div>
          <div className="theme-forest rounded-lg bg-[var(--surface)] p-6 text-[var(--fg)] md:p-8">
            <p className="readout text-accent-400">Prefer to talk?</p>
            <p className="mt-3 text-[var(--fg-muted)]">Message us on WhatsApp{calUrl ? " or book a short discovery call" : ""} and a senior consultant will pick it up.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <WhatsAppLink className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-[var(--line)] px-5 font-semibold transition-colors hover:bg-[var(--line)]" />
              {calUrl && <a href={calUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-pill bg-accent-400 px-5 font-semibold text-ink-950 transition-colors hover:bg-[#f5b674]">Book a discovery call</a>}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-2">
            <Photo image={images["contact-nairobi-sunset"]} ratio="aspect-[4/3]" className="rounded-md"
              sizes="(min-width: 1320px) 500px, (min-width: 1280px) 38vw, 100vw" />
          </div>
          <MapEmbed />
        </aside>
      </div>
    </>
  );
}
