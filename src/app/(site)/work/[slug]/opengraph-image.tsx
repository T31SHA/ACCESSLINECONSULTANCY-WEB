import { ogImage, ogSize } from "@/lib/og";
import { getCaseStudy as get } from "@/lib/content";

export const alt = "Accessline Consultancy Limited";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await get(slug);
  return ogImage({ eyebrow: "Case study", title: item?.title ?? "Accessline Consultancy Limited" });
}
