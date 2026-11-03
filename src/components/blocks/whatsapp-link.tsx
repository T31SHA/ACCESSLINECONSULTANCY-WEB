"use client";

import { WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

export function WhatsAppLink({ className }: { className?: string }) {
  return (
    <a href={site.whatsapp} target="_blank" rel="noopener" onClick={() => track("WhatsApp Click", { page: window.location.pathname })} className={className}>
      <WhatsAppIcon className="size-5" /> WhatsApp us
    </a>
  );
}
