/**
 * Single source of truth for local site photography (public/images/**).
 * Alt text comes verbatim from the photo MANIFEST.md (service/industry photos: accessline-photos-v2).
 * All photos are Pexels/Unsplash-licensed stock: free for commercial use, credit optional
 * (credited anyway on /terms). Replace with authentic Accessline photography when available.
 * Team portraits are intentionally NOT stock — keep the monogram placeholders.
 */

export type PhotoLicence = "Pexels License" | "Unsplash License";

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: { photographer: string; licence: PhotoLicence; source: string };
  /**
   * 4:3 crop of a portrait/square original (scripts/crop-photos.mjs). <Photo> serves this in its
   * 4:3 boxes so no cropped-away pixels are downloaded. width/height above stay the original's.
   */
  crop?: { src: string; width: number; height: number };
};

export const images = {
  // Home – hero (priority)
  "hero-nairobi-skyline": { src: "/images/home/hero-nairobi-skyline.webp", alt: "Nairobi skyline under a dramatic cloudy sky", width: 2000, height: 1333,
    credit: { photographer: "Mukula Igavinchi", licence: "Pexels License", source: "https://www.pexels.com/photo/nairobi-skyline-with-dramatic-cloudscape-36202135/" } },
  // Home – closing CTA band ("Ready to lead the change?")
  "home-cta-nairobi-cbd-night": { src: "/images/home/home-cta-nairobi-cbd-night.webp", alt: "Long-exposure view of Nairobi's central business district at night", width: 2000, height: 1290,
    credit: { photographer: "Click Smith (Nick254 Media Ltd)", licence: "Unsplash License", source: "https://unsplash.com/photos/833P7yxEHF8" } },
  // About – hero / story section
  "about-nairobi-skyscrapers": { src: "/images/about/about-nairobi-skyscrapers.webp", alt: "Modern skyscrapers in Nairobi against a clear sky", width: 2000, height: 2655,
    credit: { photographer: "J .rigah", licence: "Pexels License", source: "https://www.pexels.com/photo/modern-architectural-skyline-in-nairobi-31904144/" },
    crop: { src: "/images/about/about-nairobi-skyscrapers.4x3.webp", width: 2000, height: 1500 } },
  // Industries – page hero
  "industries-hero-nairobi-cityscape": { src: "/images/industries/industries-hero-nairobi-cityscape.webp", alt: "Nairobi cityscape on a sunny day with green tree cover", width: 2000, height: 1125,
    credit: { photographer: "Kenny Murgor", licence: "Unsplash License", source: "https://unsplash.com/photos/IaJm3mq0F5o" } },
  // Careers – page hero
  "careers-hero-westlands": { src: "/images/careers/careers-hero-westlands.webp", alt: "High-rise office towers in Westlands, Nairobi", width: 2000, height: 1333,
    credit: { photographer: "Brian Marete", licence: "Unsplash License", source: "https://unsplash.com/photos/V3YD8ACd0s0" } },
  // Contact – hero / map side panel
  "contact-nairobi-sunset": { src: "/images/contact/contact-nairobi-sunset.webp", alt: "Aerial view of Nairobi at sunset with warm golden light", width: 2000, height: 3000,
    credit: { photographer: "Youngafrikanna .", licence: "Pexels License", source: "https://www.pexels.com/photo/nairobi-skyline-at-sunset-with-urban-landmarks-38133494/" },
    crop: { src: "/images/contact/contact-nairobi-sunset.4x3.webp", width: 2000, height: 1500 } },
  // Services – PR & Media Relations
  "service-pr-media-relations": { src: "/images/services/service-pr-media-relations.webp", alt: "African spokesperson in a suit answering journalists holding microphones", width: 1600, height: 2400,
    credit: { photographer: "Werner Pfennig", licence: "Pexels License", source: "https://www.pexels.com/photo/6950231/" },
    crop: { src: "/images/services/service-pr-media-relations.4x3.webp", width: 1600, height: 1200 } },
  // Services – Strategic Communications
  "service-strategic-communications": { src: "/images/services/service-strategic-communications.webp", alt: "Strategist mapping messaging ideas on sticky notes on a whiteboard", width: 1600, height: 1943,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/17714158/" },
    crop: { src: "/images/services/service-strategic-communications.4x3.webp", width: 1600, height: 1200 } },
  // Services – Strategic Planning
  "service-strategic-planning": { src: "/images/services/service-strategic-planning.webp", alt: "Analyst presenting charts and graphs pinned to a whiteboard", width: 1600, height: 2400,
    credit: { photographer: "Kaboompics", licence: "Pexels License", source: "https://www.pexels.com/photo/7876509/" },
    crop: { src: "/images/services/service-strategic-planning.4x3.webp", width: 1600, height: 1200 } },
  // Services – Capacity Building & Training
  "service-capacity-building-training": { src: "/images/services/service-capacity-building-training.webp", alt: "Facilitator delivering a training session beside a flip chart", width: 1600, height: 2400,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/9034265/" },
    crop: { src: "/images/services/service-capacity-building-training.4x3.webp", width: 1600, height: 1200 } },
  // Services – Social & Behaviour Change Communication
  "service-sbcc": { src: "/images/services/service-sbcc.webp", alt: "Health outreach workers speaking with residents in a rural community", width: 1600, height: 1067,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/37285163/" } },
  // Services – Research & Market Intelligence
  "service-research-market-intelligence": { src: "/images/services/service-research-market-intelligence.webp", alt: "Researchers analysing data and charts on a laptop and tablet", width: 1600, height: 1068,
    credit: { photographer: "AlphaTradeZone", licence: "Pexels License", source: "https://www.pexels.com/photo/5784805/" } },
  // Services – Events & Experiential
  "service-events": { src: "/images/services/service-events.webp", alt: "Speaker presenting on a lit conference stage", width: 1600, height: 2400,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/29708255/" },
    crop: { src: "/images/services/service-events.4x3.webp", width: 1600, height: 1200 } },
  // Services – Creative & Multimedia
  "service-creative-multimedia": { src: "/images/services/service-creative-multimedia.webp", alt: "African photographer holding a DSLR camera up to shoot", width: 1600, height: 1629,
    credit: { photographer: "Dennis Ojenomoh", licence: "Pexels License", source: "https://www.pexels.com/photo/8394305/" },
    crop: { src: "/images/services/service-creative-multimedia.4x3.webp", width: 1600, height: 1200 } },
  // Industries – Corporate
  "industry-corporate": { src: "/images/industries/industry-corporate.webp", alt: "Executive presenting to colleagues around a boardroom table", width: 1600, height: 1067,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/1367274/" } },
  // Industries – NGOs & Development
  "industry-ngos": { src: "/images/industries/industry-ngos.webp", alt: "Volunteers preparing food supplies beside a relief van", width: 1600, height: 1067,
    credit: { photographer: "RDNE Stock project", licence: "Pexels License", source: "https://www.pexels.com/photo/6646855/" } },
  // Industries – Public Sector
  "industry-public-sector": { src: "/images/industries/industry-public-sector.webp", alt: "Uniformed officers being briefed in a formal training hall", width: 1600, height: 1201,
    credit: { photographer: "ARISTIDE OUEDRAOGO", licence: "Pexels License", source: "https://www.pexels.com/photo/31820972/" } },
  // Industries – Education
  "industry-education": { src: "/images/industries/industry-education.webp", alt: "African schoolchildren learning at their desks in a classroom", width: 1600, height: 1067,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/28593054/" } },
  // Industries – Health
  "industry-health": { src: "/images/industries/industry-health.webp", alt: "Doctor in consultation with a patient at a clinic desk", width: 1600, height: 1067,
    credit: { photographer: "Ninthgrid", licence: "Pexels License", source: "https://www.pexels.com/photo/30677597/" } },
  // Industries – Technology
  "industry-technology": { src: "/images/industries/industry-technology.webp", alt: "Developer writing code on a desktop and laptop in a Nairobi office", width: 1600, height: 1067,
    credit: { photographer: "Naboth Otieno", licence: "Pexels License", source: "https://www.pexels.com/photo/19805876/" } },
  // Industries – Environment & Sustainability
  "industry-environment-sustainability": { src: "/images/industries/industry-environment-sustainability.webp", alt: "Hand planting a tree seedling in soil in Uganda", width: 1600, height: 1177,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/35744764/" } },
  // Industries – Retail & FMCG
  "industry-retail-fmcg": { src: "/images/industries/industry-retail-fmcg.webp", alt: "Shopkeeper standing among packed shelves of goods in a local shop", width: 1600, height: 2400,
    credit: { photographer: "Pexels contributor (see source)", licence: "Pexels License", source: "https://www.pexels.com/photo/35704478/" },
    crop: { src: "/images/industries/industry-retail-fmcg.4x3.webp", width: 1600, height: 1200 } },
  // Industries – Financial Services
  "industry-financial-services": { src: "/images/industries/industry-financial-services.webp", alt: "Bank teller assisting customers at a service counter", width: 1600, height: 2405,
    credit: { photographer: "Thang Nguyen", licence: "Pexels License", source: "https://www.pexels.com/photo/38815862/" },
    crop: { src: "/images/industries/industry-financial-services.4x3.webp", width: 1600, height: 1200 } },
  // Work / case studies – featured card
  "work-case-study-media-production": { src: "/images/work/work-case-study-media-production.webp", alt: "Cameraman with a stabiliser filming an outdoor event", width: 2000, height: 3000,
    credit: { photographer: "Alfredo Dacosta", licence: "Pexels License", source: "https://www.pexels.com/photo/cameraman-filming-at-outdoor-event-in-ghana-39715315/" },
    crop: { src: "/images/work/work-case-study-media-production.4x3.webp", width: 2000, height: 1500 } },
  // Insights – listing hero / default article image
  "insights-press-microphones": { src: "/images/insights/insights-press-microphones.webp", alt: "Row of broadcast microphones on a press-conference desk", width: 2000, height: 1333,
    credit: { photographer: "Yunus Erdogdu", licence: "Pexels License", source: "https://www.pexels.com/photo/microphones-on-desk-at-press-conference-15920138/" } },
  // Careers – culture section
  "careers-team-collaboration": { src: "/images/careers/careers-team-collaboration.webp", alt: "Colleagues brainstorming together with laptops and sticky notes", width: 2000, height: 3000,
    credit: { photographer: "Tima Miroshnichenko", licence: "Pexels License", source: "https://www.pexels.com/photo/a-group-of-people-brainstorming-6913321/" },
    crop: { src: "/images/careers/careers-team-collaboration.4x3.webp", width: 2000, height: 1500 } },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/** Service slug → photo. */
export const serviceImages: Partial<Record<string, SiteImage>> = {
  "pr-media-relations": images["service-pr-media-relations"],
  "strategic-communications": images["service-strategic-communications"],
  "strategic-planning": images["service-strategic-planning"],
  "capacity-building-training": images["service-capacity-building-training"],
  sbcc: images["service-sbcc"],
  "research-market-intelligence": images["service-research-market-intelligence"],
  events: images["service-events"],
  "creative-multimedia": images["service-creative-multimedia"],
};

/** Industry slug → photo. */
export const industryImages: Partial<Record<string, SiteImage>> = {
  corporate: images["industry-corporate"],
  ngos: images["industry-ngos"],
  "public-sector": images["industry-public-sector"],
  education: images["industry-education"],
  health: images["industry-health"],
  technology: images["industry-technology"],
  "environment-sustainability": images["industry-environment-sustainability"],
  "retail-fmcg": images["industry-retail-fmcg"],
  "financial-services": images["industry-financial-services"],
};

/** Featured case study → photo (used only when the CMS entry has no image of its own). */
export const caseStudyImages: Partial<Record<string, SiteImage>> = {
  "national-immunisation-drive": images["work-case-study-media-production"],
};

/** Fallback for insight posts without their own image. */
export const defaultPostImage = images["insights-press-microphones"];

/** Unique photographer credits, in manifest order (for the Photo credits note). */
export const photoCredits = Object.values(images as Record<string, SiteImage>).reduce<SiteImage["credit"][]>(
  (acc, { credit }) => (acc.some((c) => c.source === credit.source) ? acc : [...acc, credit]),
  [],
);
