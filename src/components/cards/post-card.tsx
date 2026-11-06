import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/content/types";
import { MediaFrame } from "@/components/ui/media-frame";
import { Photo } from "@/components/ui/photo";
import { defaultPostImage } from "@/lib/images";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, large }: { post: Post; large?: boolean }) {
  const ratio = large ? "aspect-[16/10]" : "aspect-[3/2]";
  // Large = full container width (insights featured); small = 3-up grid from md (1024px).
  const sizes = large ? "(min-width: 1320px) 1280px, 100vw" : "(min-width: 1320px) 420px, (min-width: 1024px) 33vw, 100vw";
  return (
    <article data-reveal className="group relative flex flex-col">
      <div className="overflow-hidden rounded-lg border border-[var(--line)] transition-[border-color,box-shadow] duration-300 group-hover:border-accent-400/50 group-hover:shadow-hover">
        {post.image ? (
          <MediaFrame src={post.image} alt={post.imageAlt} ratio={ratio} sizes={sizes} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        ) : (
          <Photo image={defaultPostImage} ratio={ratio} sizes={sizes} imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="readout rounded-pill border border-[var(--line)] px-2.5 py-1 text-[var(--fg)]">{post.category}</span>
        <span className="readout text-[var(--fg-muted)]"><time dateTime={post.date}>{formatDate(post.date)}</time>{post.readingMinutes ? ` · ${post.readingMinutes} min read` : ""}</span>
      </div>
      <h3 className={large ? "mt-3 text-h2" : "mt-3 text-[1.375rem] leading-tight"}>
        <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4">{post.title}</Link>
      </h3>
      <p className="mt-3 text-[var(--fg-muted)]">{post.excerpt}</p>
      <p aria-hidden className="readout mt-4 inline-flex items-center gap-1.5">
        Read insight <ArrowUpRight strokeWidth={1.5} className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </p>
    </article>
  );
}
