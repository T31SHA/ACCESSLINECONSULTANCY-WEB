import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/page-hero";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms governing use of the Accessline Consultancy website.",
  path: "/terms",
});

// DRAFT — requires legal review before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Terms", path: "/terms" }]} title="Terms of use" lede="Last updated: November 2026" />
      <article className="container-site prose-site pb-[var(--section-y)]">
        <p>This website is operated by {site.legalName}, {site.address.street}, {site.address.locality}, {site.address.countryName}. By using it you agree to these terms.</p>
        <h2>Content</h2>
        <p>All content, including text, graphics and case studies, is owned by {site.legalName} or its clients and may not be reproduced without permission.</p>
        <h2>No professional advice</h2>
        <p>Insights published here are for general information and do not constitute professional advice for your specific situation.</p>
        <h2>Liability</h2>
        <p>We take care to keep information accurate but accept no liability for loss arising from reliance on it, to the extent permitted by law.</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of Kenya.</p>
      </article>
    </>
  );
}
