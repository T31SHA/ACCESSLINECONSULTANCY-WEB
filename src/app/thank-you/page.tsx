import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Thank You — We've Got Your Brief",
  description: "Thanks for contacting Accessline Consultancy. A senior consultant will reply within one working day.",
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <section className="container-site section">
      <p className="eyebrow text-[var(--fg-muted)]">Brief received</p>
      <h1 className="mt-6 max-w-[14ch] text-display">Thank you. We&apos;re on it.</h1>
      <p className="mt-8 max-w-[52ch] text-lg text-[var(--fg-muted)]">A senior consultant will reply within one working day. Check your inbox for a confirmation — or skip the queue and book a call now.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a href={site.calUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-pill bg-accent-400 px-7 py-3.5 font-semibold text-ink-950 hover:bg-[#f5b674]">Book a 30-min call</a>
        <ButtonLink href="/work" variant="outline" size="lg">See our work</ButtonLink>
      </div>
    </section>
  );
}
