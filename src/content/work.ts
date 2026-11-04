import { published, type CaseStudy, type ClientLogo, type Testimonial } from "./types";

/**
 * SAMPLE CONTENT: illustrative structure only. Replace with 3 to 6 approved,
 * metric-backed case studies from the client before launch (see CONTENT.md).
 */
const allCaseStudies: CaseStudy[] = [
  {
    slug: "national-immunisation-drive",
    client: "National health programme",
    title: "Closing the immunisation gap in 12 counties",
    summary: "An SBCC campaign co-created with caregivers and community health promoters to bring missed children back for vaccines.",
    services: ["sbcc", "research-market-intelligence", "creative-multimedia"],
    industry: "health",
    year: 2024,
    challenge: "Uptake of routine immunisation had stalled in hard-to-reach counties, driven by misinformation, distance and low trust in facilities.",
    approach: [
      "Formative research with 600+ caregivers and 40 focus groups across 12 counties.",
      "Co-created radio dramas and community dialogues in six local languages.",
      "Equipped 1,200 community health promoters with conversation toolkits.",
    ],
    metrics: [
      { value: "+23%", label: "Uptake in target counties" },
      { value: "4.1M", label: "People reached by radio" },
      { value: "1,200", label: "Health promoters trained" },
    ],
    quote: { text: "They listened to communities first. That is why the numbers moved.", author: "Programme lead", role: "Health programme" },
    sample: true,
  },
  {
    slug: "fintech-market-entry",
    client: "Pan-African fintech",
    title: "From unknown to trusted in a new market",
    summary: "Launch PR and founder positioning that made a challenger fintech a credible name with regulators, press and customers.",
    services: ["pr-media-relations", "strategic-communications", "events"],
    industry: "financial-services",
    year: 2023,
    challenge: "A well-funded fintech entering Kenya with zero brand recognition and a sceptical regulator.",
    approach: [
      "Narrative and message house built around financial inclusion outcomes.",
      "Exclusive launch briefings with tier-one business media.",
      "Founder thought-leadership programme and regulator roundtables.",
    ],
    metrics: [
      { value: "86", label: "Pieces of earned coverage" },
      { value: "92%", label: "Positive or neutral sentiment" },
      { value: "3×", label: "Branded search in 90 days" },
    ],
    sample: true,
  },
  {
    slug: "county-climate-dialogues",
    client: "Climate resilience consortium",
    title: "Turning climate data into community action",
    summary: "Participatory dialogues and storytelling that put county climate plans in citizens' hands.",
    services: ["strategic-communications", "events", "capacity-building-training"],
    industry: "environment-sustainability",
    year: 2024,
    challenge: "County climate action plans were technically sound but unknown to the communities expected to implement them.",
    approach: [
      "Plain-language summaries and visual explainers of county plans.",
      "Facilitated ward-level dialogues with farmers, youth and women's groups.",
      "Trained county communication officers to sustain engagement.",
    ],
    metrics: [
      { value: "48", label: "Ward dialogues held" },
      { value: "9,500", label: "Citizens engaged in person" },
      { value: "6", label: "Counties with adopted plans" },
    ],
    sample: true,
  },
];

export const caseStudies = published(allCaseStudies);
export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** SAMPLE: replace with 3+ approved, attributable testimonials. */
export const testimonials: Testimonial[] = published([
  { quote: "Accessline understood our audiences better than we did. Coverage, sentiment and enquiries all moved in the same quarter.", author: "Head of Corporate Affairs", role: "Corporate Affairs", organisation: "Regional bank", sample: true },
  { quote: "Rigorous, culturally fluent and fast. They turned a complex programme into a story donors and communities both believed.", author: "Country Director", role: "Leadership", organisation: "International NGO", sample: true },
  { quote: "Our spokespeople went from dreading interviews to asking for them.", author: "Communications Manager", role: "Communications", organisation: "Public agency", sample: true },
]);

/** CLIENT TO SUPPLY: permitted client logos (SVG). Names render as wordmarks until then. */
export const clientLogos: ClientLogo[] = published([
  { name: "Partner One", sample: true },
  { name: "Partner Two", sample: true },
  { name: "Partner Three", sample: true },
  { name: "Partner Four", sample: true },
  { name: "Partner Five", sample: true },
  { name: "Partner Six", sample: true },
]);
