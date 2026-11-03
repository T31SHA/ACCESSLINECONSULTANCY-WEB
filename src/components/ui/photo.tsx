import Image from "next/image";
import type { SiteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  image: SiteImage;
  /** Must describe the rendered width at each breakpoint (sm 768 · md 1024 · lg 1280 · container 1320). */
  sizes: string;
  /** Aspect-ratio box class; pass "" when the parent sizes the frame (e.g. absolute inset-0 backgrounds). */
  ratio?: string;
  className?: string;
  imgClassName?: string;
  /** Home hero only: eager + high fetch priority + preload. Every other photo lazy-loads. */
  hero?: boolean;
  /** Use the original rather than the 4:3 crop (only for boxes taller than 4:3). */
  uncropped?: boolean;
  /** Encoder quality. Photos behind the 80% scrim can go low (50) without visible loss. */
  quality?: 50 | 65;
};

/** Local stock photo from src/lib/images.ts, rendered with `fill` inside a fixed box so CLS stays 0. */
export function Photo({ image, sizes, ratio = "aspect-[4/3]", className, imgClassName, hero, uncropped, quality = 65 }: Props) {
  const file = (!uncropped && image.crop) || image;
  return (
    <div className={cn("relative overflow-hidden bg-forest-900", ratio, className)}>
      <Image
        src={file.src}
        alt={image.alt}
        fill
        sizes={sizes}
        quality={quality}
        placeholder="empty"
        className={cn("object-cover", imgClassName)}
        {...(hero ? { priority: true, fetchPriority: "high" as const } : {})}
      />
    </div>
  );
}

/**
 * Deep-navy (#2C3140) scrim for text over photos. 80% wherever small text can sit
 * (sand-50 on worst-case white pixel ≥ 5.1:1); fades to 60% only on the text-free side at ≥1024px.
 */
export function PhotoScrim({ side = "left", className }: { side?: "left" | "right"; className?: string }) {
  return <div aria-hidden className={cn("photo-scrim absolute inset-0", side === "right" && "photo-scrim-r", className)} />;
}
