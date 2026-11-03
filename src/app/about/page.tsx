import type { Metadata } from "next";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { TeamGrid } from "@/components/blocks/team-grid";
import { Timeline } from "@/components/blocks/timeline";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { team } from "@/content/people";
import { sampleFacts, site } from "@/content/site";
import { published } from "@/content/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Nairobi PR & Communications Agency",
  description: "Accessline Consultancy Limited is a Nairobi strategic communications and PR agency helping organisations across Africa lead the change.",
  path: "/about",
});

// SAMPLE — unverified milestones; client to confirm.
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

export default function AboutPage() {
  const leaders = team.filter((m) => m.leadership);
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        overline={sampleFacts ? `Est. ${sampleFacts.foundingYear} · Nairobi` : "Nairobi"}
        title="We help Africa's changemakers be heard and believed."
        lede={`${site.name} is a strategic communications and PR agency. We shape how corporates, NGOs and governments talk to the people who matter most.`}
      />

      {milestones.length > 0 && (
        <section className="section container-site pt-0">
          <SectionHeading overline="Our story" title="How we got here" />
          <Timeline items={milestones} />
        </section>
      )}

      <section className="theme-dark section bg-[var(--surface)] text-[var(--fg)]">
        <div className="container-site grid gap-px overflow-hidden rounded-lg bg-[var(--line)] md:grid-cols-2">
          <div className="bg-[var(--surface)] p-8 md:p-12" data-reveal>
            <p className="eyebrow text-[var(--fg-muted)]">Vision</p>
            <p className="mt-6 font-display text-h3 font-bold">An Africa whose stories are told with clarity, credibility and pride.</p>
          </div>
          <div className="bg-[var(--surface)] p-8 md:p-12" data-reveal>
            <p className="eyebrow text-[var(--fg-muted)]">Mission</p>
            <p className="mt-6 font-display text-h3 font-bold">To equip organisations with the strategy, voice and evidence to lead change in their markets.</p>
          </div>
        </div>
        <div className="container-site mt-20">
          <h2 className="text-h2">Values</h2>
          <ul className="mt-12 grid gap-8 md:grid-cols-4">
            {values.map((v) => (
              <li key={v.title} data-reveal className="border-t border-[var(--line)] pt-6">
                <h3 className="text-xl">{v.title}</h3>
                <p className="mt-2 text-[var(--fg-muted)]">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {leaders.length > 0 && (
        <section className="section container-site">
          <SectionHeading overline="Leadership" title="The people accountable for your outcome." action={<ButtonLink href="/team" variant="arrow">Meet the team</ButtonLink>} />
          <TeamGrid members={leaders} />
        </section>
      )}

      <section className="section container-site border-t border-[var(--line)]">
        <SectionHeading overline="Credentials" title="Registered, compliant, accountable." />
        <ul className="grid gap-6 md:grid-cols-3">
          {[
            ["Registered in Kenya", `${site.legalName}, ${site.address.street}, ${site.address.locality}.`],
            ["Data protection", "Processes personal data in line with the Kenya Data Protection Act, 2019."],
          ].map(([t, b]) => (
            <li key={t} data-reveal className="rounded-lg border border-[var(--line)] p-8">
              <h3 className="text-xl">{t}</h3>
              <p className="mt-2 text-[var(--fg-muted)]">{b}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
