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
      <div className="container-site grid gap-16 pb-[var(--section-y)] lg:grid-cols-12">
        <section aria-label="Project brief" className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 md:p-10 lg:col-span-7">
          <LeadForm services={services.map(opt)} industries={industries.map(opt)} />
        </section>
        <aside className="space-y-10 lg:col-span-5">
          <ul className="space-y-6">
            <li className="flex gap-4"><MapPin aria-hidden strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-forest-500" /><address className="not-italic">{site.address.street}<br />{site.address.locality}, {site.address.countryName}</address></li>
            <li className="flex gap-4"><Mail aria-hidden strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-forest-500" /><a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">{site.email}</a></li>
            <li className="flex gap-4"><Phone aria-hidden strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-forest-500" /><a href={site.phoneHref} className="underline-offset-4 hover:underline">{site.phone}</a></li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <WhatsAppLink className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-[var(--line)] px-5 font-semibold hover:bg-[var(--line)]" />
            {calUrl && <a href={calUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-pill border border-[var(--line)] px-5 font-semibold hover:bg-[var(--line)]">Book a discovery call</a>}
          </div>
          <Photo image={images["contact-nairobi-sunset"]} ratio="aspect-[4/3]" className="rounded-lg"
            sizes="(min-width: 1320px) 520px, (min-width: 1280px) 40vw, 100vw" />
          <MapEmbed />
        </aside>
      </div>
    </>
  );
}
