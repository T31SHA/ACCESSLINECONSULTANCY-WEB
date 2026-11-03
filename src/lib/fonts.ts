import localFont from "next/font/local";

// Self-hosted, vendored WOFF2 (OFL; latin subset, variable axes), preloaded. Two families only.
export const syne = localFont({ src: "../fonts/syne-latin-var.woff2", weight: "600 700", variable: "--font-syne", display: "swap", preload: true });
export const inter = localFont({ src: "../fonts/inter-latin-var.woff2", weight: "100 900", variable: "--font-inter", display: "swap", preload: true });
