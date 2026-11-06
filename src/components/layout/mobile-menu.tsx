"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { ButtonLink } from "@/components/ui/button";
import { nav, site } from "@/content/site";
import { Logo } from "./logo";

/** Full-screen mobile menu. Lazy-loaded by Header on first interaction. */
export function MobileMenu({ open, onOpenChange, returnFocusRef }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** The menu button lives outside Radix (no Dialog.Trigger), so focus is returned explicitly. */
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            returnFocusRef.current?.focus();
          }}
          className="theme-dark page-enter fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[var(--surface)] text-[var(--fg)]">
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">Primary navigation</Dialog.Description>
          <div className="container-site flex h-[72px] shrink-0 items-center justify-between">
            <Link href="/" className="text-white" onClick={() => onOpenChange(false)}><Logo /></Link>
            <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-[var(--line)]" aria-label="Close menu">
              <X aria-hidden strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile" className="container-site flex-1 py-8">
            <ul className="border-t border-[var(--line)]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-[var(--line)] py-3 font-display text-[2.25rem] font-bold leading-tight transition-colors hover:text-mint-200 aria-[current=page]:text-accent-400"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-6 shrink-0 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-site space-y-4 pb-10">
            <ButtonLink href="/contact" size="lg" withArrow className="w-full" onClick={() => onOpenChange(false)}>Start a project</ButtonLink>
            <p className="flex flex-wrap gap-x-6 text-sm text-[var(--fg-muted)]">
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{site.email}</a>
              <a href={site.phoneHref} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{site.phone}</a>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
