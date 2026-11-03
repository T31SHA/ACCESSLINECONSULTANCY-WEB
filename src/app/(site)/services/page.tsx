import type { Metadata } from "next";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { ServiceCard } from "@/components/cards/service-card";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PR, Strategy & Communications Services",
  description: "PR and media relations, strategic communications, SBCC, research, training, events and creative — one integrated team in Nairobi.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        overline="Services"
        title="Everything it takes to be heard — and believed."
        lede="Eight disciplines under one roof, orchestrated around the outcome you need. Pick one, or let us design the mix."
      />
      <section className="container-site pb-[var(--section-y)]" aria-labelledby="all-services">
        <h2 id="all-services" className="sr-only">All services</h2>
        <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
