import { ButtonLink } from "@/components/ui/button";
import { site } from "@/content/site";

export type CtaBandProps = { title?: string; body?: string };

/** Presentational CTA band (Storybook-friendly). */
export function CtaBandView({
  title = "Ready to lead the change?",
  body = "Tell us the outcome you need. We'll come back with a point of view.",
  calUrl,
}: CtaBandProps & { calUrl?: string }) {
  return (
    <section className="theme-forest relative overflow-hidden bg-[var(--surface)] text-[var(--fg)]">
      <div aria-hidden className="topo absolute inset-0 opacity-[0.12] [filter:invert(1)]" />
      <div className="container-site section relative grid gap-10 md:grid-cols-12 md:items-end">
        <h2 className="text-display md:col-span-8" data-reveal>{title}</h2>
        <div className="md:col-span-4" data-reveal>
          <p className="text-[var(--fg-muted)]">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact" size="lg" withArrow>Start a project</ButtonLink>
            {calUrl ? (
              <a href={calUrl} className="inline-flex min-h-11 items-center rounded-pill border border-current px-6 font-semibold hover:bg-sand-50 hover:text-forest-900" rel="noopener" target="_blank">
                Book a call
              </a>
            ) : (
              <a href={site.phoneHref} className="inline-flex min-h-11 items-center rounded-pill border border-current px-6 font-semibold hover:bg-sand-50 hover:text-forest-900">
                Call us
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
