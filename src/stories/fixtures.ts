import { industries } from "@/content/industries";
import { posts } from "@/content/insights";
import { team } from "@/content/people";
import { services } from "@/content/services";
import { caseStudies, clientLogos, testimonials } from "@/content/work";

/** Story fixtures come from the local content layer (same shapes the CMS returns). */
export const fx = { services, industries, posts, team, caseStudies, clientLogos, testimonials };
export const opt = ({ slug, title }: { slug: string; title: string }) => ({ slug, title });
