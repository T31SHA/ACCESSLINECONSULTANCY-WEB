import { ogImage, ogSize } from "@/lib/og";
import { getPost as get } from "@/content/insights";

export const alt = "Accessline Consultancy";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({ eyebrow: get(slug)?.category ?? "Insight", title: get(slug)?.title ?? "Accessline Consultancy" });
}
