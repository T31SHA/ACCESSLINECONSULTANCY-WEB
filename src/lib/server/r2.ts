import "server-only";
import { AwsClient } from "aws4fetch";

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

export const r2Configured = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET);

const client = r2Configured
  ? new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY!, service: "s3", region: "auto" })
  : null;

/** Presigned PUT URL (10 min) for a private CV object in R2. */
export async function presignCvUpload(key: string, contentType: string) {
  if (!client) throw new Error("R2 not configured");
  const url = new URL(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`);
  url.searchParams.set("X-Amz-Expires", "600");
  const signed = await client.sign(new Request(url, { method: "PUT", headers: { "content-type": contentType } }), {
    aws: { signQuery: true },
  });
  return signed.url;
}

/** Deletes a CV object. Returns true on success or if the object is already gone. */
export async function deleteCvObject(key: string) {
  if (!client) return false;
  const res = await client.fetch(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`, { method: "DELETE" });
  return res.ok || res.status === 404;
}
