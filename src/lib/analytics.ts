type Props = Record<string, string | number | boolean>;
declare global {
  interface Window { plausible?: (event: string, opts?: { props?: Props }) => void }
}
/** Plausible custom event (no-op if the script isn't loaded). */
export const track = (event: string, props?: Props) => window.plausible?.(event, props ? { props } : undefined);

export function trackingMeta() {
  const p = new URLSearchParams(window.location.search);
  const get = (k: string) => p.get(k) ?? sessionStorage.getItem(k) ?? undefined;
  return {
    sourcePage: window.location.pathname,
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    referrer: document.referrer || undefined,
  };
}
