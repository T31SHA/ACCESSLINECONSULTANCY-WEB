"use client";

import dynamic from "next/dynamic";

/** The particle canvas is decorative and far below the fold: keep it out of the critical bundle. */
export const LazyFooterField = dynamic(() => import("./footer-field").then((m) => m.FooterField), { ssr: false });
