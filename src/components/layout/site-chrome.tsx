import Script from "next/script";
import { JsonLd } from "@/components/ui/json-ld";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { getIndustries, getServices, getSiteSettings } from "@/lib/content";
import { organizationSchema } from "@/lib/schema";
import { Footer } from "./footer";
import { Header } from "./header";

/** Marketing-site chrome: skip link, header, footer, analytics, org schema. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [services, industries, settings] = await Promise.all([getServices(), getIndustries(), getSiteSettings()]);
  const nav = services.map(({ slug, title, short, icon }) => ({ slug, title, short, icon }));
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-accent-400 focus:px-5 focus:py-3 focus:font-semibold focus:text-ink-950">
        Skip to content
      </a>
      <Header services={nav} />
      <main id="main" tabIndex={-1} className="focus:outline-none">{children}</main>
      <Footer services={nav} industryCount={industries.length} socials={settings.socials} />
      <RevealObserver />
      <JsonLd data={organizationSchema(settings.socials)} />
      {plausibleDomain && (
        <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.tagged-events.outbound-links.js" strategy="lazyOnload" />
      )}
    </>
  );
}
