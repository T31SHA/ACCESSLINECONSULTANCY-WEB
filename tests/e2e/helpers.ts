import { createHmac, randomUUID } from "node:crypto";

export const uniqueEmail = (tag: string) => `${tag}-${randomUUID().slice(0, 8)}@example.com`;

/** Sanity webhook signature: t=<ms>,v1=base64url(HMAC-SHA256(secret, `${t}.${body}`)). */
export function sanitySignature(body: string, secret: string, t = Date.now()) {
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url");
  return `t=${t},v1=${sig}`;
}
