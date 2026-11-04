import { ogImage, ogSize } from "@/lib/og";

export const alt = "Accessline Consultancy Limited. Lead the change. We build brands Africa trusts.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "The PR & Brand Strategy Agency for Africa", title: "Lead the change. We build brands Africa trusts." });
}
