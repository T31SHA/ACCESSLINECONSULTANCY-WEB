import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId } from "./env";

const client = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: !process.env.SANITY_API_READ_TOKEN,
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: "published",
    })
  : null;

/** Tag-cached fetch; /api/revalidate busts tags on publish. Hourly fallback revalidation. */
export async function sanityFetch<T>(query: string, params: QueryParams = {}, tags: string[] = []): Promise<T> {
  if (!client) throw new Error("Sanity is not configured");
  return client.fetch<T>(query, params, { next: { tags: ["sanity", ...tags], revalidate: 3600 } });
}
