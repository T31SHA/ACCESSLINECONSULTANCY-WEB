import { published } from "./types";

/** Default origin until the new domain is live; override with NEXT_PUBLIC_SITE_URL (no trailing slash). */
const DEFAULT_SITE_URL = "https://slategrey-deer-824136.hostingersite.com";
/** Kenyan number in E.164 digits: the ONE place the phone number is stored. */
const PHONE_E164 = "254729963218";
const phoneDisplay = `+${PHONE_E164.slice(0, 3)} ${PHONE_E164.slice(3, 6)} ${PHONE_E164.slice(6, 9)} ${PHONE_E164.slice(9)}`; // +254 729 963 218

/**
 * site_settings: single source of truth for company name and contact details.
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
  /** Every absolute URL (canonicals, sitemap, robots, OG, JSON-LD, email links) derives from this. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, ""),
  locale: "en_KE",
  /** Contact email (single config value; set NEXT_PUBLIC_CONTACT_EMAIL to change it). */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@accesslineconsultancy.com",
  phone: phoneDisplay,
  phoneHref: `tel:+${PHONE_E164}`,
  /** Same number; confirm WhatsApp is enabled on it before launch (LAUNCH.md). */
  whatsapp: `https://wa.me/${PHONE_E164}`,
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

/** Unverified company facts, hidden when HIDE_SAMPLE_CONTENT=true. */
export const sampleFacts = published([{ foundingYear: 2012, sample: true }])[0];

export const nav = [
  { label: "Services", href: "/services", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
] as const;

/** SAMPLE: unverified figures. Replace with client-verified numbers, then drop `sample`. */
export const stats = published([
  { value: 12, suffix: "+", label: "Years shaping African narratives", sample: true },
  { value: 150, suffix: "+", label: "Campaigns delivered", sample: true },
  { value: 9, suffix: "", label: "Sectors served", sample: true },
  { value: 14, suffix: "", label: "Countries reached", sample: true },
]);

export const approach = [
  { n: "01", title: "Listen", body: "Audit the audience, the landscape and the noise. Find the truth worth telling." },
  { n: "02", title: "Frame", body: "Build the strategy, message house and measurable objectives before a single asset." },
  { n: "03", title: "Mobilise", body: "Earned, owned and community channels, orchestrated rather than scattered." },
  { n: "04", title: "Measure", body: "Report on outcomes that matter to the board: reach, sentiment, behaviour, revenue." },
] as const;
