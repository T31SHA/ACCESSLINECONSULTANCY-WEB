import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Duotone media frame. Falls back to an art-directed topographic panel until
 * authentic Nairobi photography is supplied — never stock imagery.
 */
export function MediaFrame({
  src, alt = "", label, className, priority, sizes = "(min-width: 1024px) 50vw, 100vw", ratio = "aspect-[4/5]",
}: { src?: string; alt?: string; label?: string; className?: string; priority?: boolean; sizes?: string; ratio?: string }) {
  return (
    <div className={cn("duotone rounded-lg", ratio, className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div aria-hidden={!label} role={label ? "img" : undefined} aria-label={label} className="topo absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 [filter:invert(1)]" />
      )}
    </div>
  );
}
