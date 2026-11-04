import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Accordion } from "@/components/blocks/accordion";
import { CtaBandView } from "@/components/blocks/cta-band-view";
import { LogoMarquee } from "@/components/blocks/logo-marquee";
import { MapEmbed } from "@/components/blocks/map-embed";
import { PageHero } from "@/components/blocks/page-hero";
import { StatCounter } from "@/components/blocks/stat-counter";
import { TeamGrid } from "@/components/blocks/team-grid";
import { TestimonialSlider } from "@/components/blocks/testimonial-slider";
import { Timeline } from "@/components/blocks/timeline";
import { WorkFilter } from "@/components/blocks/work-filter";
import { fx, opt } from "./fixtures";

const meta: Meta = { title: "Blocks" };
export default meta;

export const Stats: StoryObj = {
  render: () => (
    <div className="container-site grid grid-cols-2 gap-6 py-12 lg:grid-cols-4">
      <StatCounter value={120} suffix="+" label="Example metric" />
      <StatCounter value={9} label="Sectors served" />
      <StatCounter value={48} label="Example metric" />
      <StatCounter value={3} suffix="×" label="Example uplift" />
    </div>
  ),
};
export const Marquee: StoryObj = { render: () => <LogoMarquee logos={fx.clientLogos} /> };
export const Testimonials: StoryObj = { render: () => <div className="container-site py-12"><TestimonialSlider items={fx.testimonials} /></div> };
export const StoryTimeline: StoryObj = {
  name: "Timeline",
  render: () => (
    <div className="container-site py-12">
      <Timeline items={[{ year: "Then", title: "Founded", body: "Example milestone." }, { year: "Next", title: "Expanded", body: "Example milestone." }, { year: "Later", title: "Research unit", body: "Example milestone." }, { year: "Now", title: "Africa-wide", body: "Example milestone." }]} />
    </div>
  ),
};
export const FaqAccordion: StoryObj = { render: () => <div className="container-site py-12"><Accordion items={fx.services[0]!.faqs} /></div> };
export const CtaWithBooking: StoryObj = { render: () => <CtaBandView calUrl="https://cal.com/example" /> };
export const CtaWithoutBooking: StoryObj = { render: () => <CtaBandView title="Your outcome next?" /> };
export const Hero: StoryObj = {
  render: () => <PageHero crumbs={[{ name: "Services", path: "/services" }]} overline="Services" title="Everything it takes to be heard, and believed." lede="Eight disciplines under one roof." />,
};
export const Team: StoryObj = { render: () => <div className="container-site py-12"><TeamGrid members={fx.team} /></div> };
export const WorkFiltering: StoryObj = {
  render: () => <div className="container-site py-12"><WorkFilter items={fx.caseStudies} services={fx.services.map(opt)} industries={fx.industries.map(opt)} /></div>,
};
export const Map: StoryObj = { render: () => <div className="container-site max-w-xl py-12"><MapEmbed /></div> };
