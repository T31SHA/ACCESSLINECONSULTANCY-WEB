import type { Industry } from "./types";

const seo = (title: string, description: string) => ({ title, description });

export const industries: Industry[] = [
  {
    slug: "corporate",
    title: "Corporate",
    short: "Reputation, investor and stakeholder communications for ambitious businesses.",
    seo: seo("Corporate Communications Agency Kenya", "Corporate reputation, stakeholder relations and executive positioning for businesses operating in Kenya and Africa."),
    challenges: ["Building trust with regulators, investors and communities at once", "Executive visibility that feels credible, not promotional", "Managing issues before they become crises"],
    approach: "We pair corporate affairs rigour with newsroom instinct, positioning leadership, protecting licence to operate and turning strategy into stories stakeholders believe.",
  },
  {
    slug: "ngos",
    title: "NGOs & Development",
    short: "Advocacy, SBCC and donor visibility that proves impact.",
    seo: seo("Communications for NGOs in Kenya", "Advocacy, SBCC, donor visibility and impact storytelling for NGOs and development partners across Africa."),
    challenges: ["Showing impact to donors without reducing people to statistics", "Reaching last-mile communities with relevant messages", "Coordinating consortium partners around one voice"],
    approach: "Evidence first, dignity always. We co-create with communities, align to programme log-frames and tell impact stories with the people at their centre.",
  },
  {
    slug: "public-sector",
    title: "Public Sector",
    short: "Citizen engagement and policy communication that builds public trust.",
    seo: seo("Government Communications Consultancy Kenya", "Public-sector communications, citizen engagement and policy campaigns for national and county governments."),
    challenges: ["Explaining complex policy in plain language", "Reaching citizens across 47 counties and many languages", "Rebuilding trust in public institutions"],
    approach: "Clear, inclusive, accountable. We design public-information campaigns and participation processes that reach every citizen and stand up to scrutiny.",
  },
  {
    slug: "education",
    title: "Education",
    short: "Enrolment, reputation and advocacy for institutions and edtech.",
    seo: seo("Education Marketing & Communications Kenya", "Communications, reputation and enrolment campaigns for universities, schools and education programmes."),
    challenges: ["Standing out in a crowded enrolment market", "Communicating reforms to parents and teachers", "Showcasing research and alumni impact"],
    approach: "We turn institutional strengths into compelling stories for students, parents, faculty and funders.",
  },
  {
    slug: "health",
    title: "Health",
    short: "Behaviour change and health communication that saves lives.",
    seo: seo("Health Communications Agency Kenya", "Health communication, SBCC and public-health campaigns for ministries, NGOs and healthcare providers."),
    challenges: ["Combating misinformation", "Driving uptake of services and products", "Communicating sensitively on stigmatised issues"],
    approach: "Formative research, community co-creation and rigorous message testing, so health messages are trusted, understood and acted on.",
  },
  {
    slug: "technology",
    title: "Technology",
    short: "Launch, scale and thought leadership for Africa's tech builders.",
    seo: seo("Tech PR Agency Nairobi", "PR, launches and thought leadership for technology and fintech companies building in Africa."),
    challenges: ["Explaining complex products to non-technical audiences", "Earning credibility with investors and regulators", "Breaking through a noisy startup ecosystem"],
    approach: "We translate technology into human outcomes and position founders as the voices shaping Africa's digital future.",
  },
  {
    slug: "environment-sustainability",
    title: "Environment & Sustainability",
    short: "Climate and ESG communications that are credible, not greenwash.",
    seo: seo("Sustainability & ESG Communications Africa", "Climate, conservation and ESG communications for organisations committed to sustainable impact in Africa."),
    challenges: ["Avoiding greenwashing accusations", "Making climate data meaningful to communities", "Mobilising action, not just awareness"],
    approach: "Substance before story. We help organisations communicate commitments transparently and mobilise communities around climate action.",
  },
  {
    slug: "retail-fmcg",
    title: "Retail & FMCG",
    short: "Brand love and launches that move product off shelves.",
    seo: seo("FMCG & Retail PR Agency Kenya", "Consumer PR, product launches and experiential campaigns for retail and FMCG brands in Kenya."),
    challenges: ["Cutting through cluttered consumer media", "Launching products across diverse markets", "Building brand loyalty beyond price"],
    approach: "Consumer insight, cultural relevance and experiential flair: campaigns people talk about and buy into.",
  },
  {
    slug: "financial-services",
    title: "Financial Services",
    short: "Trust, compliance-ready communication and financial inclusion.",
    seo: seo("Financial Services PR Agency Kenya", "Reputation, financial-literacy and inclusion campaigns for banks, insurers, SACCOs and fintechs."),
    challenges: ["Earning trust in a sceptical market", "Communicating within regulatory constraints", "Driving financial literacy and inclusion"],
    approach: "Precise, compliant and human. We make financial brands understandable and trusted, from boardroom to boda-boda rider.",
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
