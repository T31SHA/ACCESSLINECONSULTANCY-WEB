import { published, type Job, type TeamMember } from "./types";

/**
 * CLIENT TO SUPPLY: real names, photos, bios and LinkedIn URLs.
 * Sample entries are role-only so nothing fictional is attributed to a real person.
 */
export const team: TeamMember[] = published([
  { slug: "managing-director", name: "Managing Director", role: "Managing Director", department: "Leadership", leadership: true, bio: "Leads strategy and client partnerships across the firm. Bio to be supplied.", sample: true },
  { slug: "head-of-pr", name: "Head of PR & Media", role: "Head of PR & Media", department: "PR & Media", leadership: true, bio: "Leads the press office and media relations practice. Bio to be supplied.", sample: true },
  { slug: "head-of-strategy", name: "Head of Strategy", role: "Head of Strategy", department: "Strategy", leadership: true, bio: "Leads strategy, research and SBCC engagements. Bio to be supplied.", sample: true },
  { slug: "creative-director", name: "Creative Director", role: "Creative Director", department: "Creative", leadership: true, bio: "Leads design, film and content production. Bio to be supplied.", sample: true },
]);

export const departments = [
  { name: "PR & Media", body: "Newsroom relationships, press office and crisis response." },
  { name: "Strategy & Research", body: "Insight, planning and measurement." },
  { name: "SBCC & Development", body: "Community-rooted behaviour change programmes." },
  { name: "Creative & Multimedia", body: "Design, film, photography and content." },
  { name: "Events & Experiential", body: "Launches, summits and activations." },
  { name: "Operations & Finance", body: "The engine that keeps every engagement on track." },
] as const;

export const culture = [
  { title: "Africa first", body: "We tell African stories from African perspectives." },
  { title: "Outcomes over output", body: "We measure what changed, not what we shipped." },
  { title: "Craft and candour", body: "High standards, honest feedback, no ego." },
  { title: "Grow here", body: "Training budgets, mentorship and real responsibility early." },
] as const;

/** SAMPLE roles — replace with live vacancies from the CMS. */
export const jobs: Job[] = published([
  {
    slug: "senior-pr-account-manager",
    title: "Senior PR Account Manager",
    department: "PR & Media",
    location: "Nairobi (Hybrid)",
    type: "Full-time",
    posted: "2026-10-15",
    validThrough: "2026-12-15",
    summary: "Lead a portfolio of corporate and development clients, own media relationships and grow a team of account executives.",
    responsibilities: ["Own day-to-day client relationships and PR plans", "Pitch and secure tier-one coverage", "Lead crisis response for assigned accounts", "Coach and review the work of account executives"],
    requirements: ["5+ years in PR, agency or newsroom", "Strong East African media network", "Outstanding writing in English; Kiswahili an advantage", "Degree in communications, journalism or related field"],
    sample: true,
  },
  {
    slug: "sbcc-programme-officer",
    title: "SBCC Programme Officer",
    department: "SBCC & Development",
    location: "Nairobi, with county travel",
    type: "Contract",
    posted: "2026-10-20",
    validThrough: "2026-12-01",
    summary: "Coordinate community-level SBCC activities, pre-testing and MEL data collection for health programmes.",
    responsibilities: ["Coordinate field activities and partners", "Facilitate message pre-testing", "Collect and report MEL data"],
    requirements: ["3+ years in SBCC or public-health programmes", "Experience working with community health structures", "Fluency in Kiswahili"],
    sample: true,
  },
]);

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);
