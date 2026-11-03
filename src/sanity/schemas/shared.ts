import { defineField } from "sanity";

export const slugField = (source = "title") =>
  defineField({ name: "slug", type: "slug", options: { source, maxLength: 96 }, validation: (r) => r.required() });

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", type: "string", description: "≤ 60 characters incl. “ | Accessline”", validation: (r) => r.max(60) }),
    defineField({ name: "description", type: "text", rows: 3, validation: (r) => r.max(155) }),
  ],
});

/** Launch gate: anything marked sample is hidden when HIDE_SAMPLE_CONTENT=true. */
export const sampleField = defineField({
  name: "sample",
  title: "Sample / unverified",
  type: "boolean",
  initialValue: false,
  description: "Tick for placeholder or unverified content. Hidden on the live site at launch.",
});

export const orderField = defineField({ name: "order", type: "number", description: "Lower numbers appear first" });

export const imageWithAlt = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() })],
  });
