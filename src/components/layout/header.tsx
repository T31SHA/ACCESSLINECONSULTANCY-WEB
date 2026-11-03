"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { ServiceIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export type NavService = { slug: string; title: string; short: string; icon: string };

export function Header({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] backdrop-blur-md" : "border-transparent bg-[var(--surface)]",
      )}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} — home`} className="text-forest-700">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              "mega" in item && item.mega ? (
                <li
                  key={item.href}
                  ref={megaRef}
                  className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimer.current); setMegaOpen(true); }}
                  onMouseLeave={() => { closeTimer.current = setTimeout(() => setMegaOpen(false), 150); }}
                >
                  <button
                    type="button"
                    aria-expanded={megaOpen}
                    aria-controls="mega-services"
                    onClick={() => setMegaOpen((o) => !o)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1 rounded-pill px-4 text-[0.9375rem] font-medium hover:bg-[var(--line)]",
                      isActive(item.href) && "text-forest-700",
                    )}
                  >
                    {item.label}
                    <ChevronDown aria-hidden strokeWidth={1.5} className={cn("size-4 transition-transform", megaOpen && "rotate-180")} />
                  </button>
                  <div
                    id="mega-services"
                    hidden={!megaOpen}
                    className="absolute left-1/2 top-full w-[min(880px,calc(100vw-48px))] -translate-x-[30%] pt-3"
                  >
                    <div className="grid grid-cols-12 gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-3 shadow-hover">
                      <ul className="col-span-8 grid grid-cols-2 gap-1">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/services/${s.slug}`} className="flex gap-3 rounded-md p-3 hover:bg-mint-50">
                              <ServiceIcon name={s.icon} className="mt-0.5 size-5 shrink-0 text-forest-500" />
                              <span>
                                <span className="block text-sm font-semibold">{s.title}</span>
                                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[var(--fg-muted)]">{s.short}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="theme-forest col-span-4 flex flex-col justify-between rounded-md bg-[var(--surface)] p-6 text-[var(--fg)]">
                        <div>
                          <p className="eyebrow text-[var(--fg-muted)]">Not sure where to start?</p>
                          <p className="mt-3 font-display text-xl font-bold leading-tight">Tell us the outcome. We&apos;ll design the mix.</p>
                        </div>
                        <Link href="/services" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">
                          All services <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-pill px-4 text-[0.9375rem] font-medium hover:bg-[var(--line)]",
                      isActive(item.href) && "text-forest-700",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" className="hidden sm:inline-flex">Start a project</ButtonLink>
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-[var(--line)] lg:hidden" aria-label="Open menu">
                <Menu aria-hidden strokeWidth={1.5} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content className="theme-dark page-enter fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[var(--surface)] text-[var(--fg)]">
                <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                <Dialog.Description className="sr-only">Primary navigation</Dialog.Description>
                <div className="container-site flex h-[72px] shrink-0 items-center justify-between">
                  <Link href="/" className="text-sand-50"><Logo /></Link>
                  <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-[var(--line)]" aria-label="Close menu">
                    <X aria-hidden strokeWidth={1.5} />
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile" className="container-site flex-1 py-8">
                  <ul className="space-y-1">
                    {nav.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="block py-2 font-display text-[2.5rem] font-bold leading-tight hover:text-mint-200">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="container-site space-y-4 pb-10">
                  <ButtonLink href="/contact" size="lg" withArrow className="w-full">Start a project</ButtonLink>
                  <p className="text-sm text-[var(--fg-muted)]">
                    <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">{site.email}</a>
                  </p>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
