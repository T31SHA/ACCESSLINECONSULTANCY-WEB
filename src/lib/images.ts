/**
 * Single source of truth for local site photography (public/images/**).
 * Alt text and dimensions come verbatim from the photo MANIFEST.md.
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
  "service-pr-media-relations": { src: "/images/services/service-pr-media-relations.webp", alt: "Spokesperson in a suit answering journalists holding microphones", width: 2000, height: 3000,
    credit: { photographer: "Werner Pfennig", licence: "Pexels License", source: "https://www.pexels.com/photo/journalists-hands-holding-microphones-around-man-in-suit-6950231/" },
    crop: { src: "/images/services/service-pr-media-relations.4x3.webp", width: 2000, height: 1500 } },
  // Services – Strategic Communications
  "service-strategic-communications": { src: "/images/services/service-strategic-communications.webp", alt: "Leadership team aligning on messaging around a boardroom table", width: 2000, height: 1333,
    credit: { photographer: "Ninthgrid", licence: "Unsplash License", source: "https://unsplash.com/photos/YsJUxCIW14U" } },
  // Services – Strategic Planning
  "service-strategic-planning": { src: "/images/services/service-strategic-planning.webp", alt: "Consultant leading a strategy discussion with colleagues in a conference room", width: 2000, height: 3000,
    credit: { photographer: "Mikhail Nilov", licence: "Pexels License", source: "https://www.pexels.com/photo/men-having-a-meeting-in-a-conference-room-9301763/" },
    crop: { src: "/images/services/service-strategic-planning.4x3.webp", width: 2000, height: 1500 } },
  // Services – Capacity Building & Training
  "service-capacity-building": { src: "/images/services/service-capacity-building.webp", alt: "Participants with laptops in a business training workshop", width: 2000, height: 2500,
    credit: { photographer: "Beniam", licence: "Pexels License", source: "https://www.pexels.com/photo/diverse-team-engaged-in-business-training-workshop-34046709/" },
    crop: { src: "/images/services/service-capacity-building.4x3.webp", width: 2000, height: 1500 } },
  // Services – Social & Behaviour Change Communication
  "service-sbcc": { src: "/images/services/service-sbcc.webp", alt: "Community members gathered at an outdoor engagement meeting", width: 2000, height: 1333,
    credit: { photographer: "mk_photoz", licence: "Pexels License", source: "https://www.pexels.com/photo/community-engagement-meeting-in-kaduna-nigeria-33107901/" } },
  // Services – Research & Market Intelligence
  "service-research-market-intelligence": { src: "/images/services/service-research-market-intelligence.webp", alt: "Analyst presenting research findings and charts to colleagues", width: 2000, height: 3000,
    credit: { photographer: "Sora Shimazaki", licence: "Pexels License", source: "https://www.pexels.com/photo/black-businesswoman-reporting-financial-results-at-meeting-5668778/" },
    crop: { src: "/images/services/service-research-market-intelligence.4x3.webp", width: 2000, height: 1500 } },
  // Services – Events & Experiential
  "service-events-experiential": { src: "/images/services/service-events-experiential.webp", alt: "Speaker addressing attendees from the stage at a conference", width: 2000, height: 1332,
    credit: { photographer: "Ufoma Ojo", licence: "Unsplash License", source: "https://unsplash.com/photos/JB1C6JbJkCQ" } },
  // Services – Creative & Multimedia
  "service-creative-multimedia": { src: "/images/services/service-creative-multimedia.webp", alt: "Cameraman filming a live event in Dar es Salaam", width: 2000, height: 1333,
    credit: { photographer: "Japhet Kweba", licence: "Pexels License", source: "https://www.pexels.com/photo/professional-cameraman-filming-event-in-tanzania-32926963/" } },
  // Industries – Corporate
  "industry-corporate": { src: "/images/industries/industry-corporate.webp", alt: "Professionals in a business meeting in a bright modern office", width: 2000, height: 1333,
    credit: { photographer: "Ninthgrid", licence: "Pexels License", source: "https://www.pexels.com/photo/business-meeting-in-lagos-office-setting-30688596/" } },
  // Industries – NGOs & Development
  "industry-ngos-development": { src: "/images/industries/industry-ngos-development.webp", alt: "Villagers seated together at a rural community meeting", width: 2000, height: 3000,
    credit: { photographer: "\u015eeyhmus Kino", licence: "Pexels License", source: "https://www.pexels.com/photo/community-gathering-in-rural-african-village-30564957/" },
    crop: { src: "/images/industries/industry-ngos-development.4x3.webp", width: 2000, height: 1500 } },
  // Industries – Public Sector
  "industry-public-sector": { src: "/images/industries/industry-public-sector.webp", alt: "Instructor leading a training session for uniformed officers", width: 2000, height: 1501,
    credit: { photographer: "ARISTIDE OUEDRAOGO", licence: "Pexels License", source: "https://www.pexels.com/photo/african-classroom-training-session-with-uniformed-students-31820972/" } },
  // Industries – Education
  "industry-education": { src: "/images/industries/industry-education.webp", alt: "Students collaborating on an assignment in a classroom", width: 2000, height: 1335,
    credit: { photographer: "Tosin Olowoleni", licence: "Pexels License", source: "https://www.pexels.com/photo/african-school-students-engaged-in-classroom-activity-34211750/" } },
  // Industries – Health
  "industry-health": { src: "/images/industries/industry-health.webp", alt: "Nutritionist advising a woman on healthy eating at home", width: 2000, height: 3000,
    credit: { photographer: "Yaroslav Shuraev", licence: "Pexels License", source: "https://www.pexels.com/photo/a-nutritionist-educating-a-woman-8844553/" },
    crop: { src: "/images/industries/industry-health.4x3.webp", width: 2000, height: 1500 } },
  // Industries – Technology
  "industry-technology": { src: "/images/industries/industry-technology.webp", alt: "Product team brainstorming with sticky notes in a tech office", width: 2000, height: 2830,
    credit: { photographer: "Ketut Subiyanto", licence: "Pexels License", source: "https://www.pexels.com/photo/a-meeting-in-the-office-4623479/" },
    crop: { src: "/images/industries/industry-technology.4x3.webp", width: 2000, height: 1500 } },
  // Industries – Environment & Sustainability
  "industry-environment-sustainability": { src: "/images/industries/industry-environment-sustainability.webp", alt: "Rows of solar panels in an open field", width: 2000, height: 1333,
    credit: { photographer: "El Jundi", licence: "Pexels License", source: "https://www.pexels.com/photo/expansive-solar-farm-in-sunny-open-field-33537433/" } },
  // Industries – Retail & FMCG
  "industry-retail-fmcg": { src: "/images/industries/industry-retail-fmcg.webp", alt: "Two women choosing products in a mini-mart", width: 2000, height: 1333,
    credit: { photographer: "Ninthgrid", licence: "Pexels License", source: "https://www.pexels.com/photo/happy-shopping-experience-in-lagos-mini-mart-30689327/" } },
  // Industries – Financial Services
  "industry-financial-services": { src: "/images/industries/industry-financial-services.webp", alt: "Market vendor using a mobile phone at his stall", width: 2000, height: 2000,
    credit: { photographer: "Clarence Gaspar", licence: "Pexels License", source: "https://www.pexels.com/photo/street-vendor-using-mobile-phone-in-market-36969131/" },
    crop: { src: "/images/industries/industry-financial-services.4x3.webp", width: 2000, height: 1500 } },
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
  "capacity-building-training": images["service-capacity-building"],
  sbcc: images["service-sbcc"],
  "research-market-intelligence": images["service-research-market-intelligence"],
  events: images["service-events-experiential"],
  "creative-multimedia": images["service-creative-multimedia"],
};

/** Industry slug → photo. */
export const industryImages: Partial<Record<string, SiteImage>> = {
  corporate: images["industry-corporate"],
  ngos: images["industry-ngos-development"],
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
