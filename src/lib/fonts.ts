import localFont from "next/font/local";

// Self-hosted, vendored WOFF2 (OFL; latin subset, variable axes), preloaded. Syne + Inter + IBM Plex Mono (UI chrome, labels, stats).
export const syne = localFont({ src: "../fonts/syne-latin-var.woff2", weight: "600 700", variable: "--font-syne", display: "swap", preload: true });
export const inter = localFont({ src: "../fonts/inter-latin-var.woff2", weight: "100 900", variable: "--font-inter", display: "swap", preload: true });
export const plexMono = localFont({
  src: [{ path: "../fonts/ibm-plex-mono-latin-400.woff2", weight: "400" }, { path: "../fonts/ibm-plex-mono-latin-500.woff2", weight: "500" }],
  variable: "--font-plex-mono", display: "swap", preload: false,
});
