"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Link from "next/link";
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
            <Link href="/" className="text-sand-50" onClick={() => onOpenChange(false)}><Logo /></Link>
            <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-[var(--line)]" aria-label="Close menu">
              <X aria-hidden strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile" className="container-site flex-1 py-8">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => onOpenChange(false)} className="block py-2 font-display text-[2.5rem] font-bold leading-tight hover:text-mint-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-site space-y-4 pb-10">
            <ButtonLink href="/contact" size="lg" withArrow className="w-full" onClick={() => onOpenChange(false)}>Start a project</ButtonLink>
            <p className="text-sm text-[var(--fg-muted)]">
              <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">{site.email}</a>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
