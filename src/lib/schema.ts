import { site } from "@/content/site";
import type { Faq, Job, Post, Service, TeamMember } from "@/content/types";
import { absoluteUrl } from "./seo";

const orgId = absoluteUrl("/#organization");

export const organizationSchema = (socials: Partial<Record<string, string>> = site.socials) => ({
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": orgId,
  name: site.name,
  legalName: site.legalName,
  slogan: site.tagline,
  description: site.description,
  url: site.url,
  logo: absoluteUrl("/logo.svg"),
  image: absoluteUrl("/opengraph-image"),
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressCountry: site.address.country,
  },
  areaServed: [{ "@type": "Country", name: "Kenya" }, { "@type": "Place", name: "Africa" }],
  knowsAbout: ["Public relations", "Media relations", "Strategic communications", "SBCC", "Market research", "Events"],
  ...(Object.values(socials).some(Boolean) ? { sameAs: Object.values(socials).filter(Boolean) } : {}),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const serviceSchema = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.title,
  description: s.seo.description,
  serviceType: s.title,
  url: absoluteUrl(`/services/${s.slug}`),
  provider: { "@id": orgId },
  areaServed: { "@type": "Place", name: "Africa" },
});

export const faqSchema = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const articleSchema = (p: Post, author?: TeamMember) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: p.title,
  description: p.excerpt,
  datePublished: p.date,
  dateModified: p.date,
  url: absoluteUrl(`/insights/${p.slug}`),
  image: absoluteUrl(`/insights/${p.slug}/opengraph-image`),
  author: author ? { "@type": "Person", name: author.name, jobTitle: author.role } : { "@id": orgId },
  publisher: { "@id": orgId },
  inLanguage: "en-KE",
});

export const jobSchema = (j: Job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: j.title,
  description: `<p>${j.summary}</p><ul>${j.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>`,
  datePosted: j.posted,
  validThrough: j.validThrough,
  employmentType: j.type === "Full-time" ? "FULL_TIME" : j.type === "Contract" ? "CONTRACTOR" : "INTERN",
  hiringOrganization: { "@type": "Organization", name: site.legalName, sameAs: site.url },
  jobLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  },
});

export const personSchema = (m: TeamMember) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: m.name,
  jobTitle: m.role,
  worksFor: { "@id": orgId },
  ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
});
