import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { MediaFrame } from "@/components/ui/media-frame";
import { SectionHeading } from "@/components/ui/section-heading";

const meta: Meta = { title: "UI/Primitives" };
export default meta;

export const Buttons: StoryObj = {
  render: () => (
    <div className="container-site flex flex-wrap items-center gap-4 py-12">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <ButtonLink href="/work" variant="arrow">Arrow link</ButtonLink>
      <Button size="lg" withArrow>Large with arrow</Button>
      <Magnetic><ButtonLink href="/contact" size="lg" withArrow>Magnetic CTA</ButtonLink></Magnetic>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const Heading: StoryObj = {
  render: () => (
    <div className="container-site py-12">
      <SectionHeading overline="What we do" title="Eight disciplines. One clear narrative." intro="Pick one, or let us design the mix." action={<ButtonLink href="/services" variant="arrow">All services</ButtonLink>} />
    </div>
  ),
};

export const Media: StoryObj = {
  render: () => (
    <div className="container-site grid gap-6 py-12 md:grid-cols-3">
      <MediaFrame label="Duotone fallback, portrait" />
      <MediaFrame label="Duotone fallback, 4:3" ratio="aspect-[4/3]" />
      <MediaFrame label="Duotone fallback, 16:9" ratio="aspect-[16/9]" />
    </div>
  ),
};
