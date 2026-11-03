import Link from "next/link";
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
      {post.image ? (
        <MediaFrame src={post.image} alt={post.imageAlt} ratio={ratio} sizes={sizes} />
      ) : (
        <Photo image={defaultPostImage} ratio={ratio} sizes={sizes} className="rounded-lg" />
      )}
      <p className="eyebrow mt-5 text-[var(--fg-muted)]">{post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time></p>
      <h3 className={large ? "mt-3 text-h2" : "mt-3 text-[1.375rem] leading-tight"}>
        <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4">{post.title}</Link>
      </h3>
      <p className="mt-3 text-[var(--fg-muted)]">{post.excerpt}</p>
    </article>
  );
}
