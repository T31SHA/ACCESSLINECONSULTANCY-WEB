import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { IndustryTile } from "@/components/cards/industry-tile";
import { PostCard } from "@/components/cards/post-card";
import { ServiceCard } from "@/components/cards/service-card";
import { fx } from "./fixtures";

const meta: Meta = { title: "Cards" };
export default meta;

export const ServiceCards: StoryObj = {
  render: () => (
    <div className="container-site py-12">
      <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
        {fx.services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
      </div>
    </div>
  ),
};

export const CaseStudyCards: StoryObj = {
  render: () => (
    <div className="container-site grid gap-6 py-12 md:grid-cols-3">
      {fx.caseStudies.map((c) => <CaseStudyCard key={c.slug} cs={c} industryTitle={fx.industries.find((i) => i.slug === c.industry)?.title} />)}
    </div>
  ),
};

export const PostCards: StoryObj = {
  render: () => (
    <div className="container-site grid gap-6 py-12 md:grid-cols-3">
      {fx.posts.map((p) => <PostCard key={p.slug} post={p} />)}
    </div>
  ),
};

export const IndustryTiles: StoryObj = {
  render: () => <ul className="container-site border-t border-[var(--line)] py-12">{fx.industries.map((i) => <IndustryTile key={i.slug} industry={i} />)}</ul>,
};
