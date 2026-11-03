import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "arrow";
type Size = "md" | "lg";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // Amber reserved for primary CTAs only
  primary: "rounded-pill bg-accent-400 text-ink-950 hover:bg-[#f5b674] hover:shadow-hover",
  outline: "rounded-pill border border-current text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--surface)]",
  ghost: "rounded-pill text-[var(--fg)] hover:bg-[var(--line)]",
  arrow: "text-[var(--fg)] underline-offset-[6px] hover:underline !min-h-0 !px-0",
};
const sizes: Record<Size, string> = { md: "px-5 py-2.5 text-[0.9375rem]", lg: "px-7 py-3.5 text-base" };

export const buttonClasses = (variant: ButtonVariant = "primary", size: Size = "md", className?: string) =>
  cn(base, sizes[size], variants[variant], className);

const Arrow = () => (
  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.75} />
);

type CommonProps = { variant?: ButtonVariant; size?: Size; children: ReactNode; withArrow?: boolean };

export function Button({ variant = "primary", size = "md", className, children, withArrow, ...props }: CommonProps & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {(withArrow || variant === "arrow") && <Arrow />}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, children, withArrow, ...props }: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {(withArrow || variant === "arrow") && <Arrow />}
    </Link>
  );
}
