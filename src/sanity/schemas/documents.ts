import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, orderField, sampleField, seoField, slugField } from "./shared";

const SERVICE_ICONS = ["Megaphone", "Compass", "Route", "GraduationCap", "HeartHandshake", "ChartNoAxesCombined", "CalendarRange", "Clapperboard"];

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const service = defineType({
  name: "service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    orderField,
    defineField({ name: "short", title: "One-line summary", type: "string", validation: (r) => r.required().max(120) }),
    defineField({ name: "icon", type: "string", options: { list: SERVICE_ICONS }, initialValue: "Compass" }),
    defineField({ name: "problem", type: "text", rows: 3 }),
    defineField({ name: "outcome", type: "text", rows: 3 }),
    defineField({ name: "deliverables", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({
      name: "process",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "body", type: "text", rows: 2 })] })],
    }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })] }),
    seoField,
    sampleField,
  ],
});

export const industry = defineType({
  name: "industry",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    orderField,
    defineField({ name: "short", type: "string", validation: (r) => r.required() }),
    defineField({ name: "challenges", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "approach", type: "text", rows: 4 }),
    seoField,
    sampleField,
  ],
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "client", type: "string", description: "Client name, or an anonymised descriptor if not permitted" }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "services", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })] }),
    defineField({ name: "industry", type: "reference", to: [{ type: "industry" }] }),
    defineField({ name: "year", type: "number" }),
    imageWithAlt("image", "Hero image"),
    defineField({ name: "challenge", type: "text", rows: 4 }),
    defineField({ name: "approach", type: "array", of: [defineArrayMember({ type: "text", rows: 2 })] }),
    defineField({
      name: "metrics",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [defineField({ name: "value", type: "string" }), defineField({ name: "label", type: "string" })] })],
    }),
    defineField({
      name: "quote",
      type: "object",
      fields: [defineField({ name: "text", type: "text", rows: 3 }), defineField({ name: "author", type: "string" }), defineField({ name: "role", type: "string" })],
    }),
    sampleField,
  ],
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    slugField("name"),
    orderField,
    defineField({ name: "role", type: "string" }),
    defineField({ name: "department", type: "string" }),
    imageWithAlt("photo"),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "bio", type: "text", rows: 5 }),
    defineField({ name: "leadership", type: "boolean", initialValue: false }),
    sampleField,
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const testimonial = defineType({
  name: "testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "author", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "organisation", type: "string" }),
    sampleField,
  ],
  preview: { select: { title: "author", subtitle: "organisation" } },
});

export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client logo",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    orderField,
    defineField({ name: "logo", type: "image", description: "SVG preferred. Only logos the client has permission to show." }),
    sampleField,
  ],
});

export const post = defineType({
  name: "post",
  title: "Insight",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "excerpt", type: "text", rows: 2 }),
    defineField({ name: "category", type: "string", options: { list: ["Media", "Strategy", "SBCC", "Research", "Brand"] } }),
    defineField({ name: "publishedAt", type: "date", validation: (r) => r.required() }),
    defineField({ name: "readingMinutes", type: "number" }),
    defineField({ name: "author", type: "reference", to: [{ type: "teamMember" }] }),
    imageWithAlt("image"),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "body",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "section",
        fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "paragraphs", type: "array", of: [defineArrayMember({ type: "text", rows: 4 })] })],
        preview: { select: { title: "heading" } },
      })],
    }),
    seoField,
    sampleField,
  ],
});

export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "department", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "type", type: "string", options: { list: ["Full-time", "Contract", "Internship"] } }),
    defineField({ name: "posted", type: "date" }),
    defineField({ name: "validThrough", type: "date" }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "responsibilities", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "requirements", type: "array", of: [defineArrayMember({ type: "string" })] }),
    sampleField,
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "stats",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        fields: [defineField({ name: "value", type: "number" }), defineField({ name: "suffix", type: "string" }), defineField({ name: "label", type: "string" }), sampleField],
      })],
    }),
    defineField({
      name: "socials",
      type: "object",
      fields: ["linkedin", "x", "instagram", "facebook"].map((n) => defineField({ name: n, type: "url" })),
    }),
    defineField({ name: "calUrl", title: "Cal.com booking URL", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const schemaTypes = [siteSettings, service, industry, caseStudy, teamMember, testimonial, clientLogo, post, job, faq];
