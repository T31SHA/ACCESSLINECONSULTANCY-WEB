import { published, type Post } from "./types";

export const categories = ["Media", "Strategy", "SBCC", "Research", "Brand"] as const;

/** SAMPLE articles — replace with client-approved posts from the CMS. */
export const posts: Post[] = published([
  {
    slug: "earned-media-kenya-2026",
    title: "What earns coverage in Kenyan newsrooms now",
    excerpt: "Shrinking newsrooms, rising digital desks and the stories editors still say yes to.",
    category: "Media",
    date: "2026-10-08",
    readingMinutes: 6,
    author: "head-of-pr",
    featured: true,
    sample: true,
    body: [
      { heading: "Newsrooms have changed", paragraphs: ["Kenyan newsrooms are leaner and more digital than ever. Editors juggle print, broadcast and social desks with fewer reporters.", "That makes relevance and readiness non-negotiable: the stories that land arrive with data, visuals and a spokesperson ready to talk."] },
      { heading: "What editors still want", paragraphs: ["Local proof, human voices and a clear answer to 'why now?'. Press releases that read like adverts are deleted unread."] },
      { heading: "How to adapt", paragraphs: ["Invest in relationships, not blasts. Build a pipeline of data-led angles. Train spokespeople before you need them."] },
    ],
  },
  {
    slug: "sbcc-beyond-awareness",
    title: "SBCC beyond awareness: designing for behaviour",
    excerpt: "Why awareness campaigns plateau — and the formative research that breaks through.",
    category: "SBCC",
    date: "2026-09-22",
    readingMinutes: 8,
    author: "head-of-strategy",
    sample: true,
    body: [
      { heading: "The awareness trap", paragraphs: ["Most audiences already know the message. Knowledge is rarely the barrier; cost, norms and access usually are."] },
      { heading: "Start with barriers", paragraphs: ["Formative research identifies the real obstacles — and the motivators that outweigh them."] },
    ],
  },
  {
    slug: "brand-strategy-for-african-growth",
    title: "Brand strategy for African growth markets",
    excerpt: "One continent, 54 markets. How to build a brand that travels without losing its roots.",
    category: "Brand",
    date: "2026-08-30",
    readingMinutes: 5,
    author: "creative-director",
    sample: true,
    body: [
      { heading: "Local first, then scale", paragraphs: ["Brands that win across Africa earn their home market first and adapt deliberately as they expand."] },
    ],
  },
]);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
