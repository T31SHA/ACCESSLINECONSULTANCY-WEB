import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/page-hero";
import { TeamGrid } from "@/components/blocks/team-grid";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { culture } from "@/content/people";
import { getTeam } from "@/lib/content";
import { personSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Team — Communications Experts in Nairobi",
  description: "Meet the strategists, media specialists, researchers and creatives behind Accessline Consultancy Limited in Nairobi.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <>
      {team.filter((m) => !m.sample).map((m) => <JsonLd key={m.slug} data={personSchema(m)} />)}
      <PageHero
        crumbs={[{ name: "Team", path: "/team" }]}
        overline="Team"
        title="Strategists, storytellers, researchers, makers."
        lede="A senior-led team that has sat in newsrooms, boardrooms, ministries and communities. You work with the people you meet."
      />
      <section className="container-site pb-[var(--section-y)]">
        <TeamGrid members={team} />
      </section>
      <section className="section bg-mint-50">
        <div className="container-site">
          <SectionHeading overline="Culture" title="How we work together" action={<ButtonLink href="/careers" withArrow>Join us</ButtonLink>} />
          <ul className="grid gap-8 md:grid-cols-4">
            {culture.map((c) => (
              <li key={c.title} data-reveal className="border-t-2 border-ink-950 pt-6">
                <h3 className="text-xl">{c.title}</h3>
                <p className="mt-2 text-[var(--fg-muted)]">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
