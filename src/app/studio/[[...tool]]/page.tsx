import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main id="main" className="mx-auto max-w-xl px-6 py-24 font-sans">
        <h1 className="font-display text-3xl font-bold">Content Studio isn&apos;t connected yet</h1>
        <p className="mt-4 text-slate-600">
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code>, then redeploy. Until then the site
          serves the built-in content from <code>src/content</code>. See README → “Editing content”.
        </p>
      </main>
    );
  }
  return <Studio />;
}
