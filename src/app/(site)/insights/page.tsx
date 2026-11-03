import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/page-hero";
import { PostCard } from "@/components/cards/post-card";
import { categories } from "@/content/insights";
import { getPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights on PR, Media & Strategy in Africa",
  description: "Perspectives on media relations, strategic communications, SBCC and brand building in Kenya and across Africa.",
  path: "/insights",
});

export default async function InsightsPage() {
  const posts = await getPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);
  return (
    <>
      <PageHero crumbs={[{ name: "Insights", path: "/insights" }]} overline="Insights" title="Thinking from the front line." />
      <section className="container-site pb-[var(--section-y)]">
        <ul aria-label="Categories" className="mb-14 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c} className="rounded-pill border border-[var(--line)] px-4 py-2 text-sm">{c}</li>
          ))}
        </ul>
        {featured && <div className="mb-20"><PostCard post={featured} large /></div>}
        <div className="grid gap-x-6 gap-y-16 md:grid-cols-3">
          {rest.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </section>
    </>
  );
}
