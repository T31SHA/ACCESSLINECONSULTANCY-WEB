import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Logo } from "@/components/layout/logo";
import { fx } from "./fixtures";

const meta: Meta = { title: "Layout", parameters: { nextjs: { navigation: { pathname: "/services" } } } };
export default meta;

const nav = fx.services.map(({ slug, title, short, icon }) => ({ slug, title, short, icon }));

export const SiteHeader: StoryObj = { render: () => <><Header services={nav} /><div className="h-[60vh]" /></> };
export const MobileHeader: StoryObj = { ...SiteHeader, globals: { viewport: { value: "mobile1" } } };
export const SiteFooter: StoryObj = { render: () => <Footer services={nav} industryCount={fx.industries.length} socials={{ linkedin: "https://www.linkedin.com/" }} /> };
export const Crumbs: StoryObj = {
  render: () => <div className="container-site py-12"><Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: "SBCC", path: "/services/sbcc" }]} /></div>,
};
export const Wordmark: StoryObj = { render: () => <div className="container-site py-12 text-forest-700"><Logo /></div> };
