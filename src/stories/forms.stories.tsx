import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ApplyForm } from "@/components/forms/apply-form";
import { LeadForm } from "@/components/forms/lead-form";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ShortLeadForm } from "@/components/forms/short-lead-form";
import { fx, opt } from "./fixtures";

const meta: Meta = { title: "Forms", parameters: { nextjs: { navigation: { pathname: "/contact", query: {} } } } };
export default meta;

const card = "mx-auto my-12 max-w-3xl rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-6 md:p-10";

export const MultiStepLead: StoryObj = { render: () => <div className={card}><LeadForm services={fx.services.map(opt)} industries={fx.industries.map(opt)} /></div> };
export const ShortLead: StoryObj = { render: () => <div className={card}><ShortLeadForm /></div> };
export const Newsletter: StoryObj = { render: () => <div className="theme-dark bg-[var(--surface)] p-12 text-[var(--fg)]"><div className="max-w-sm"><NewsletterForm /></div></div> };
export const JobApplication: StoryObj = { render: () => <div className={card}><ApplyForm jobSlug="senior-pr-account-manager" jobTitle="Senior PR Account Manager" /></div> };
