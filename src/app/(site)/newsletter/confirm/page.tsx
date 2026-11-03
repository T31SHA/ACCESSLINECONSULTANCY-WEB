import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { confirmSubscription, findPendingByToken } from "@/lib/newsletter";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata({
  title: "Confirm your subscription",
  description: "Confirm your subscription to insights from Accessline Consultancy Limited.",
  path: "/newsletter/confirm",
  noindex: true,
});

type Props = { searchParams: Promise<{ token?: string; done?: string }> };

/**
 * Two-step confirm: GET shows a button, POST (server action) confirms.
 * Stops email link-scanners from auto-confirming addresses.
 */
export default async function ConfirmPage({ searchParams }: Props) {
  const { token = "", done } = await searchParams;

  async function confirm(formData: FormData) {
    "use server";
    const ok = await confirmSubscription(String(formData.get("token") ?? ""));
    redirect(ok ? "/newsletter/confirm?done=1" : "/newsletter/confirm?done=0");
  }

  let state: "confirmed" | "invalid" | "pending";
  if (done === "1") state = "confirmed";
  else if (done === "0") state = "invalid";
  else state = (await findPendingByToken(token)) ? "pending" : "invalid";

  return (
    <section className="container-site section">
      <p className="eyebrow text-[var(--fg-muted)]">Newsletter</p>
      {state === "confirmed" && (
        <>
          <h1 className="mt-6 max-w-[16ch] text-h1">You&apos;re subscribed.</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-[var(--fg-muted)]">Thanks for confirming. Insights will arrive monthly. Unsubscribe any time.</p>
          <div className="mt-10"><ButtonLink href="/insights" withArrow>Read the latest insights</ButtonLink></div>
        </>
      )}
      {state === "pending" && (
        <>
          <h1 className="mt-6 max-w-[16ch] text-h1">Confirm your subscription</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-[var(--fg-muted)]">One click and you&apos;re in.</p>
          <form action={confirm} className="mt-10">
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="inline-flex min-h-11 items-center rounded-pill bg-accent-400 px-7 py-3.5 font-semibold text-ink-950 hover:bg-[#f5b674]">Confirm subscription</button>
          </form>
        </>
      )}
      {state === "invalid" && (
        <>
          <h1 className="mt-6 max-w-[16ch] text-h1">This link has expired.</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-[var(--fg-muted)]">The confirmation link is invalid, already used, or older than two weeks. Subscribe again from the footer to get a fresh one.</p>
          <div className="mt-10"><ButtonLink href="/" variant="outline">Back to home</ButtonLink></div>
        </>
      )}
    </section>
  );
}
