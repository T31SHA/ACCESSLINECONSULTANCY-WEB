/** Content types mirror the CMS document types (sanity/schemas). */

export type Seo = { title: string; description: string };

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string; // lucide icon name
  seo: Seo;
  problem: string;
  outcome: string;
  deliverables: string[];
  process: { title: string; body: string }[];
  faqs: Faq[];
};

export type Industry = {
  slug: string;
  title: string;
  short: string;
  seo: Seo;
  challenges: string[];
  approach: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  services: string[]; // service slugs
  industry: string; // industry slug
  year: number;
  image?: string;
  imageAlt?: string;
  challenge: string;
  approach: string[];
  metrics: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
  /** true until the client supplies and approves the real case study */
  sample?: boolean;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  department: string;
  photo?: string;
  linkedin?: string;
  bio: string;
  leadership?: boolean;
  sample?: boolean;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  author: string; // team slug
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  body: { heading: string; paragraphs: string[] }[];
  sample?: boolean;
};

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  posted: string;
  validThrough: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export type Testimonial = { quote: string; author: string; role: string; organisation: string; sample?: boolean };

export type ClientLogo = { name: string; src?: string; sample?: boolean };

/** Launch gate: set HIDE_SAMPLE_CONTENT=true to strip unapproved sample entries. */
export const published = <T extends { sample?: boolean }>(items: T[]): T[] =>
  process.env.HIDE_SAMPLE_CONTENT === "true" ? items.filter((i) => !i.sample) : items;
