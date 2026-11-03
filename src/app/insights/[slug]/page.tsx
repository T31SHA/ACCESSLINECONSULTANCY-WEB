import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/blocks/cta-band";
import { PageHero } from "@/components/blocks/page-hero";
import { PostCard } from "@/components/cards/post-card";
import { JsonLd } from "@/components/ui/json-ld";
import { getPost, posts } from "@/content/insights";
import { team } from "@/content/people";
import { articleSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.excerpt, path: `/insights/${p.slug}`, type: "article" });
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const author = team.find((m) => m.slug === p.author);
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={articleSchema(p, author)} />
      <PageHero
        crumbs={[{ name: "Insights", path: "/insights" }, { name: p.title, path: `/insights/${p.slug}` }]}
        overline={p.category}
        title={p.title}
        lede={p.excerpt}
      >
        <p className="mt-8 text-sm text-[var(--fg-muted)]">
          {author && <><span className="font-semibold text-[var(--fg)]">{author.name}</span> · </>}
          <time dateTime={p.date}>{formatDate(p.date)}</time> · {p.readingMinutes} min read
        </p>
      </PageHero>
      <div className="container-site grid gap-12 pb-[var(--section-y)] lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Table of contents" className="lg:sticky lg:top-28">
            <p className="eyebrow mb-4 text-[var(--fg-muted)]">Contents</p>
            <ol className="space-y-2 text-sm">
              {p.body.map((b) => (
                <li key={b.heading}><a href={`#${anchor(b.heading)}`} className="text-[var(--fg-muted)] hover:text-[var(--fg)]">{b.heading}</a></li>
              ))}
            </ol>
          </nav>
        </aside>
        <article className="prose-site text-lg lg:col-span-8 lg:col-start-5">
          {p.body.map((b) => (
            <section key={b.heading}>
              <h2 id={anchor(b.heading)}>{b.heading}</h2>
              {b.paragraphs.map((para) => <p key={para.slice(0, 40)} className="mt-5">{para}</p>)}
            </section>
          ))}
        </article>
      </div>
      {related.length > 0 && (
        <section className="section container-site border-t border-[var(--line)]">
          <h2 className="mb-12 text-h2">Related insights</h2>
          <div className="grid gap-12 md:grid-cols-3 md:gap-6">
            {related.map((r) => <PostCard key={r.slug} post={r} />)}
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
