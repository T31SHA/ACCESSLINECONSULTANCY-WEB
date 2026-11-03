import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Duotone media frame for CMS-supplied image URLs. Falls back to an art-directed
 * topographic panel. Local stock photos use <Photo> + src/lib/images.ts instead.
 */
export function MediaFrame({
  src, alt = "", label, className, sizes = "(min-width: 1024px) 50vw, 100vw", ratio = "aspect-[4/5]",
}: { src?: string; alt?: string; label?: string; className?: string; sizes?: string; ratio?: string }) {
  return (
    <div className={cn("duotone rounded-lg", ratio, className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div aria-hidden={!label} role={label ? "img" : undefined} aria-label={label} className="topo topo-cover absolute inset-0 text-sand-50 opacity-40" />
      )}
    </div>
  );
}
