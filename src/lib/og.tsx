import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Branded OG card: forest field, sand display type, amber access line. */
export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#013D20", color: "#F7F4EE", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F7F4EE" }} />
          accessline
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#B6E3CD" }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 50 ? 64 : 80, fontWeight: 700, lineHeight: 1.02, marginTop: 20, letterSpacing: -2 }}>{title}</div>
        </div>
        <div style={{ height: 6, width: 220, background: "#F2A65A", borderRadius: 999 }} />
      </div>
    ),
    ogSize,
  );
}
