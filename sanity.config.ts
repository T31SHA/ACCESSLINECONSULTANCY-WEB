"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas/documents";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "accessline",
  title: "Accessline Consultancy Limited",
  basePath: "/studio",
  projectId: sanityProjectId || "unconfigured",
  dataset: sanityDataset,
  schema: {
    types: schemaTypes,
    // Site settings is a singleton
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  document: {
    actions: (input, ctx) => (ctx.schemaType === "siteSettings" ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : input),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: sanityApiVersion })],
});
