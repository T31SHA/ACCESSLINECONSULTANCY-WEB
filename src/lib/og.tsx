import { ImageResponse } from "next/og";
import { LOGO_PATH } from "@/components/layout/logo";

export const ogSize = { width: 1200, height: 630 };

/** Branded OG card: deep forest field, the official white logo, amber access line. */
export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#092216", color: "#F8F7F3", padding: 72, fontFamily: "sans-serif" }}>
        <svg width="276" height="70" viewBox="0 0 316 80" fill="#FFFFFF">
          <path d={LOGO_PATH} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#CFE0D6" }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 50 ? 64 : 80, fontWeight: 700, lineHeight: 1.02, marginTop: 20, letterSpacing: -2 }}>{title}</div>
        </div>
        <div style={{ height: 6, width: 220, background: "#EFA04B", borderRadius: 999 }} />
      </div>
    ),
    ogSize,
  );
}
