import { createHmac, randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect } from "@playwright/test";
import { E2E } from "./env";

export const uniqueEmail = (tag: string) => `${tag}-${randomUUID().slice(0, 8)}@example.com`;

export type OutboxMail = {
  from: string; to: string; replyTo?: string; subject: string; text: string; html: string;
  attachments: { filename: string; contentType: string; size: number }[];
};

/** Waits for the (mock) email whose reply-to is `replyTo` to land in the E2E outbox. */
export async function mailFor(replyTo: string): Promise<OutboxMail> {
  let found: OutboxMail | undefined;
  await expect.poll(async () => {
    const dir = path.resolve(E2E.outbox);
    const files = await readdir(dir).catch(() => [] as string[]);
    for (const f of files) {
      const m = JSON.parse(await readFile(path.join(dir, f), "utf8")) as OutboxMail;
      if (m.replyTo === replyTo) { found = m; return true; }
    }
    return false;
  }, { timeout: 10_000 }).toBe(true);
  return found!;
}

/** Sanity webhook signature: t=<ms>,v1=base64url(HMAC-SHA256(secret, `${t}.${body}`)). */
export function sanitySignature(body: string, secret: string, t = Date.now()) {
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url");
  return `t=${t},v1=${sig}`;
}
