import { ogImage, ogSize } from "@/lib/og";
import { getCaseStudy as get } from "@/content/work";

export const alt = "Accessline Consultancy Limited";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage({ eyebrow: "Case study", title: get(slug)?.title ?? "Accessline Consultancy Limited" });
}
