/**
 * site_settings — single source of truth for NAP, socials and brand copy.
 * CLIENT TO CONFIRM: legal name, phone, WhatsApp, socials, hours (see CONTENT.md).
 */
export const site = {
  name: "Accessline Consultancy",
  legalName: "Accessline Consultancy Ltd",
  tagline: "Lead the Change.",
  positioning: "The PR & Brand Strategy Agency for Africa.",
  description:
    "Nairobi PR and strategic communications agency. Media relations, brand strategy, SBCC, research and events for organisations across Africa since 2012.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://accesslineconsultancy.com",
  locale: "en_KE",
  foundingYear: 2012,
  email: "info@accesslineconsultancy.com",
  phone: "+254 700 000 000", // CLIENT TO CONFIRM
  phoneHref: "tel:+254700000000",
  whatsapp: "https://wa.me/254700000000", // CLIENT TO CONFIRM
  address: {
    street: "10th Floor, Ecobank Towers, Muindi Mbingu Street",
    locality: "Nairobi",
    region: "Nairobi County",
    postalCode: "00100",
    country: "KE",
    countryName: "Kenya",
  },
  geo: { lat: -1.2833, lng: 36.8172 },
  hours: [
    { days: "Monday – Friday", time: "08:00 – 17:30", schema: "Mo-Fr 08:00-17:30" },
  ],
  calUrl: process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/accessline/discovery",
  socials: {
    linkedin: "https://www.linkedin.com/company/accessline-consultancy",
    x: "https://x.com/accesslineke",
    instagram: "https://www.instagram.com/accesslineconsultancy",
  },
} as const;

export const nav = [
  { label: "Services", href: "/services", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
] as const;

/** CLIENT TO CONFIRM: real, verifiable figures. */
export const stats = [
  { value: 12, suffix: "+", label: "Years shaping African narratives" },
  { value: 150, suffix: "+", label: "Campaigns delivered" },
  { value: 9, suffix: "", label: "Sectors served" },
  { value: 14, suffix: "", label: "Countries reached" },
] as const;

export const approach = [
  { n: "01", title: "Listen", body: "Audit the audience, the landscape and the noise. Find the truth worth telling." },
  { n: "02", title: "Frame", body: "Build the strategy, message house and measurable objectives before a single asset." },
  { n: "03", title: "Mobilise", body: "Earned, owned and community channels — orchestrated, not scattered." },
  { n: "04", title: "Measure", body: "Report on outcomes that matter to the board: reach, sentiment, behaviour, revenue." },
] as const;
