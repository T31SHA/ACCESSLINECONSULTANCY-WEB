"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "@/content/types";
import { LinkedInIcon } from "@/components/ui/icons";

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");

function Portrait({ m, sizes }: { m: TeamMember; sizes: string }) {
  return (
    <div className="duotone relative aspect-[4/5] rounded-lg">
      {m.photo ? (
        <Image src={m.photo} alt={`Portrait of ${m.name}`} fill sizes={sizes} className="object-cover" />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-6xl font-bold text-mint-200/60">{initials(m.name)}</span>
      )}
    </div>
  );
}

/** Team cards that open a bio drawer. */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [open, setOpen] = useState<TeamMember | null>(null);
  return (
    <>
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => (
          <li key={m.slug} data-reveal>
            <button type="button" onClick={() => setOpen(m)} className="group block w-full text-left" aria-haspopup="dialog">
              <div className="overflow-hidden rounded-lg transition-shadow group-hover:shadow-hover">
                <Portrait m={m} sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
              <p className="mt-5 font-display text-xl font-bold group-hover:underline group-hover:underline-offset-4">{m.name}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{m.role}</p>
            </button>
          </li>
        ))}
      </ul>
      <Dialog.Root open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink-950/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-[80] w-full max-w-lg overflow-y-auto bg-[var(--surface)] p-8 text-[var(--fg)] shadow-hover data-[state=open]:animate-[drawer-in_400ms_var(--ease-out-expo)] md:p-12">
            {open && (
              <>
                <Dialog.Close aria-label="Close" className="absolute right-6 top-6 inline-flex size-11 items-center justify-center rounded-pill hover:bg-[var(--line)]">
                  <X aria-hidden strokeWidth={1.5} />
                </Dialog.Close>
                <div className="max-w-[240px]"><Portrait m={open} sizes="240px" /></div>
                <Dialog.Title className="mt-8 text-h3">{open.name}</Dialog.Title>
                <p className="mt-2 text-[var(--fg-muted)]">{open.role} · {open.department}</p>
                <Dialog.Description className="mt-6 leading-relaxed">{open.bio}</Dialog.Description>
                {open.linkedin && (
                  <a href={open.linkedin} target="_blank" rel="noopener" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline">
                    <LinkedInIcon className="size-4" /> LinkedIn<span className="sr-only"> profile of {open.name}</span>
                  </a>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
