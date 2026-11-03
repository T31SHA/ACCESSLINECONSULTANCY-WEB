import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/page-hero";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Accessline Consultancy Limited collects, uses and protects personal data under the Kenya Data Protection Act, 2019.",
  path: "/privacy",
});

// DRAFT — requires legal review before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Privacy", path: "/privacy" }]} title="Privacy policy" lede="Last updated: November 2026" />
      <article className="container-site prose-site pb-[var(--section-y)]">
        <p>{site.legalName} (&ldquo;we&rdquo;) is the data controller for personal data collected through this website. We process personal data in accordance with the Kenya Data Protection Act, 2019.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Enquiry details you submit: name, email, phone, organisation, role and your message.</li>
          <li>Job applications: contact details, CV and cover note.</li>
          <li>Newsletter subscriptions: email address.</li>
          <li>Privacy-friendly, cookie-less analytics (Plausible). No advertising trackers.</li>
        </ul>
        <h2>Why we use it</h2>
        <p>To respond to enquiries (legitimate interest / steps prior to contract), assess job applications, and — only with your consent — send insights by email.</p>
        <h2>How long we keep it</h2>
        <ul>
          <li>Enquiries: up to 24 months after last contact, unless you become a client.</li>
          <li>Job applications: 12 months.</li>
          <li>Spam submissions: 30 days.</li>
        </ul>
        <h2>Who we share it with</h2>
        <p>Processors acting on our instructions: hosting (Vercel), database (Neon), file storage (Cloudflare R2), email delivery (Resend) and bot protection (Cloudflare Turnstile). Some processors store data outside Kenya under appropriate safeguards.</p>
        <h2>Your rights</h2>
        <p>You may request access, correction, deletion or objection at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>. You may also complain to the Office of the Data Protection Commissioner (ODPC).</p>
      </article>
    </>
  );
}
