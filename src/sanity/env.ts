export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-10-01";

/** Sanity is used only when a project id is configured; otherwise the site reads src/content. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(sanityProjectId);
