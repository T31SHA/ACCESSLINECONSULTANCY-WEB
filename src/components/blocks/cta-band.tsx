import { getSiteSettings } from "@/lib/content";
import { CtaBandView, type CtaBandProps } from "./cta-band-view";

/** Data wrapper: reads the booking URL from site settings. */
export async function CtaBand(props: CtaBandProps) {
  const { calUrl } = await getSiteSettings();
  return <CtaBandView {...props} calUrl={calUrl} />;
}
