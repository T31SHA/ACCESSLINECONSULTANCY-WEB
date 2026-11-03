import { published } from "./types";

/**
 * site_settings — single source of truth for company name and contact details.
 * Only verified facts live here (see DECISIONS.md). Anything unverified is `sample: true`.
 */
export const site = {
  name: "Accessline Consultancy Limited",
  legalName: "Accessline Consultancy Limited",
  /** Short brand mark used only in the logo and <title> suffix (60-char title budget). */
  shortName: "Accessline",
  tagline: "Lead the Change.",
  positioning: "The PR & Brand Strategy Agency for Africa.",
  description:
    "Nairobi PR and strategic communications agency. Media relations, brand strategy, SBCC, research and events for organisations across Africa.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://accesslineconsultancy.com",
  locale: "en_KE",
  email: "info@accesslineconsultancy.com",
  phone: "+254 727 684443",
  phoneHref: "tel:+254727684443",
  /** Same verified number; confirm WhatsApp is enabled on it before launch (LAUNCH.md). */
  whatsapp: "https://wa.me/254727684443",
  address: {
    street: "10th Floor, Ecobank Towers",
    locality: "Nairobi",
    country: "KE",
    countryName: "Kenya",
  },
  /** Booking link only shown when configured. */
  calUrl: process.env.NEXT_PUBLIC_CAL_URL || undefined,
  /** Unverified social profiles were removed; add real URLs here or in Studio. */
  socials: {} as Partial<Record<"linkedin" | "x" | "instagram" | "facebook", string>>,
} as const;

/** Unverified company facts — hidden when HIDE_SAMPLE_CONTENT=true. */
export const sampleFacts = published([{ foundingYear: 2012, sample: true }])[0];

export const nav = [
  { label: "Services", href: "/services", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
] as const;

/** SAMPLE — unverified figures. Replace with client-verified numbers, then drop `sample`. */
export const stats = published([
  { value: 12, suffix: "+", label: "Years shaping African narratives", sample: true },
  { value: 150, suffix: "+", label: "Campaigns delivered", sample: true },
  { value: 9, suffix: "", label: "Sectors served", sample: true },
  { value: 14, suffix: "", label: "Countries reached", sample: true },
]);

export const approach = [
  { n: "01", title: "Listen", body: "Audit the audience, the landscape and the noise. Find the truth worth telling." },
  { n: "02", title: "Frame", body: "Build the strategy, message house and measurable objectives before a single asset." },
  { n: "03", title: "Mobilise", body: "Earned, owned and community channels — orchestrated, not scattered." },
  { n: "04", title: "Measure", body: "Report on outcomes that matter to the board: reach, sentiment, behaviour, revenue." },
] as const;
