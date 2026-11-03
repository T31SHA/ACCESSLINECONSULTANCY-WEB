import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Readout } from "@/components/ui/readout";
import { FooterField } from "./footer-field";

/** Interactive band that leads into the footer: particle field + one CTA. Same surface as the footer. */
export function FooterStage() {
  return (
    <section aria-labelledby="footer-stage-title" className="theme-dark relative isolate overflow-hidden bg-[var(--surface)] text-[var(--fg)]">
      {/* CSS fallback grid shows until/unless the canvas draws */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgb(182_186_197/0.35)_1px,transparent_1px)] [background-size:22px_22px]" />
      <FooterField />
      <div className="container-site relative py-24 md:py-36">
        <Readout code="SIGNAL_00" meta={`${site.address.locality} · 1.29°S 36.82°E`} className="max-w-xl" />
        <h2 id="footer-stage-title" className="mt-8 max-w-[16ch] text-h1">Have something to say? Let&rsquo;s make it heard.</h2>
        <div className="mt-10"><ButtonLink href="/contact" size="lg" withArrow>Start a project</ButtonLink></div>
      </div>
      <div aria-hidden className="container-site"><div className="h-px bg-[var(--line)]" /></div>
    </section>
  );
}
