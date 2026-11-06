import type { Metadata } from "next";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { TeamGrid } from "@/components/blocks/team-grid";
import { Timeline } from "@/components/blocks/timeline";
import { ButtonLink } from "@/components/ui/button";
import { Overline, SectionHeading } from "@/components/ui/section-heading";
import { Globe, Landmark, ShieldCheck } from "lucide-react";
import { getIndustries, getServices, getTeam } from "@/lib/content";
import { sampleFacts, site } from "@/content/site";
import { published } from "@/content/types";
import { images } from "@/lib/images";
import { Photo } from "@/components/ui/photo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us | Nairobi PR & Communications Agency",
  description: "Accessline Consultancy Limited is a Nairobi strategic communications and PR agency helping organisations across Africa lead the change.",
  path: "/about",
});

// SAMPLE: unverified milestones; client to confirm.
const milestones = published([
  { year: "2012", title: "Founded in Nairobi", body: "Started with one conviction: African organisations deserve world-class communications built on local truth.", sample: true },
  { year: "2016", title: "SBCC practice launched", body: "Expanded into behaviour change for health and development partners.", sample: true },
  { year: "2020", title: "Research & insight unit", body: "In-house research to ground every strategy in evidence.", sample: true },
  { year: "Now", title: "Africa-wide", body: "Integrated PR, strategy and creative for clients across the continent from Ecobank Towers.", sample: true },
]);

const values = [
  { title: "Truth first", body: "Credibility is the only currency that compounds." },
  { title: "Local fluency", body: "Language, culture and context are strategy, not translation." },
  { title: "Measured impact", body: "If it can't be measured, it can't be improved." },
  { title: "Courage", body: "We tell clients what they need to hear." },
];

const credentials = [
  { title: "Registered in Kenya", body: `${site.legalName}, ${site.address.street}, ${site.address.locality}.`, Icon: Landmark },
  { title: "Kenya Data Protection Act, 2019", body: "We process personal data in line with the Act, and only for the purpose it was shared.", Icon: ShieldCheck },
  { title: "Pan-African Partner Network", body: "Trusted local partners help campaigns land in each market's language, media and context.", Icon: Globe },
];

export default async function AboutPage() {
  const [team, services, industries] = await Promise.all([getTeam(), getServices(), getIndustries()]);
  const leaders = team.filter((m) => m.leadership);
  const facts = [
    ["Nairobi", "Headquarters · Ecobank Towers"],
    [String(services.length), "Integrated disciplines"],
    [String(industries.length), "Sectors served"],
  ] as const;
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        overline={sampleFacts ? `Est. ${sampleFacts.foundingYear} · Nairobi` : "Nairobi"}
        title="We help Africa's changemakers be heard and believed."
        lede={`${site.name} is a strategic communications and PR agency. We shape how corporates, NGOs and governments talk to the people who matter most.`}
        image={images["about-nairobi-skyscrapers"]}
      />

      {/* Always rendered, so the page stays complete when sample milestones are hidden. */}
      <section className="section container-site pt-0" aria-labelledby="story-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5" data-reveal>
            <Overline className="mb-5">Our story</Overline>
            <h2 id="story-title" className="text-h2">Built in Nairobi, for audiences across Africa.</h2>
          </div>
          <div className="space-y-5 text-lg text-[var(--fg-muted)] lg:col-span-7" data-reveal>
            <p>
              {site.name} exists because African organisations deserve communications built on local truth and held to international standards.
              We work from {site.address.street} in {site.address.locality}, close to the newsrooms, regulators and decision-makers our clients need to reach.
            </p>
            <p>
              Our work spans PR and media relations, brand strategy, social and behaviour change, research and events, joined up by one senior team
              so that every message, channel and metric points at the same outcome.
            </p>
          </div>
        </div>
        <dl className="mt-14 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
          {facts.map(([value, label]) => (
            <div key={label} className="flex flex-col bg-[var(--surface-raised)] p-6 md:p-8">
              <dt className="readout order-2 mt-3 text-[var(--fg-muted)]">{label}</dt>
              <dd className="order-1 font-display text-h3 font-bold text-forest-700">{value}</dd>
            </div>
          ))}
        </dl>
        {milestones.length > 0 && (
          <div className="mt-20">
            <h3 className="mb-10 text-h3">How we got here</h3>
            <Timeline items={milestones} />
          </div>
        )}
      </section>

      <section className="theme-forest relative isolate overflow-hidden section bg-[var(--surface)] text-[var(--fg)]" aria-labelledby="values-title">
        <div aria-hidden className="topo pointer-events-none absolute inset-0 -z-10 text-sand-50 opacity-[0.04]" />
        <div className="container-site grid gap-4 md:grid-cols-2 md:gap-6">
          {[
            ["Vision", "An Africa whose stories are told with clarity, credibility and pride."],
            ["Mission", "To equip organisations with the strategy, voice and evidence to lead change in their markets."],
          ].map(([label, text]) => (
            <div key={label} className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-8 md:p-12" data-reveal>
              <p className="readout flex items-center gap-3 text-accent-400">
                <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-accent-400" />{label}
              </p>
              <p className="mt-8 font-display text-h3 font-bold">{text}</p>
            </div>
          ))}
        </div>
        <div className="container-site mt-20 md:mt-28">
          <Overline className="mb-5">What we stand for</Overline>
          <h2 id="values-title" className="text-h2">Values</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.title} data-reveal className="bg-[var(--surface)] p-6 md:p-8">
                <span aria-hidden className="readout text-accent-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-xl">{v.title}</h3>
                <p className="mt-2 text-[var(--fg-muted)]">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mobile-only (kept well below the fold so it never becomes a lazy LCP); from 1024px up the hero shows it. */}
      <div className="container-site pt-[var(--section-y)] md:hidden">
        <Photo image={images["about-nairobi-skyscrapers"]} ratio="aspect-[4/3]" className="rounded-lg" sizes="100vw" />
      </div>

      {leaders.length > 0 && (
        <section className="section container-site">
          <SectionHeading overline="Leadership" title="The people accountable for your outcome." action={<ButtonLink href="/team" variant="arrow">Meet the team</ButtonLink>} />
          <TeamGrid members={leaders} />
        </section>
      )}

      <section className="section container-site border-t border-[var(--line)]">
        <SectionHeading overline="Credentials" title="Registered, compliant, accountable." />
        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {credentials.map(({ title, body, Icon }) => (
            <li key={title} data-reveal className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-8 transition-[border-color,box-shadow] duration-300 hover:border-forest-700/40 hover:shadow-hover">
              <span className="inline-flex size-11 items-center justify-center rounded-md bg-mint-50 text-forest-700">
                <Icon aria-hidden strokeWidth={1.5} className="size-5" />
              </span>
              <h3 className="mt-8 text-xl">{title}</h3>
              <p className="mt-2 text-[var(--fg-muted)]">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
