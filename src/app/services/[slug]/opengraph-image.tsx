import { ogImage, ogSize } from "@/lib/og";
import { getService as get } from "@/content/services";

export const alt = "Accessline Consultancy";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({ eyebrow: "Service", title: get(slug)?.title ?? "Accessline Consultancy" });
}
