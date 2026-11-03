import { defineConfig, devices } from "@playwright/test";
import { E2E } from "./tests/e2e/env";

const baseURL = process.env.BASE_URL ?? `http://localhost:${E2E.port}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL, contextOptions: { reducedMotion: "reduce" } },
  // Fresh mock-email outbox per run; requires `npm run build` first.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `rm -rf ${E2E.outbox} && next start -p ${E2E.port}`,
        url: `${baseURL}/robots.txt`,
        reuseExistingServer: false,
        env: { ...E2E.env },
        timeout: 120_000,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Mobile re-runs the page-level a11y/SEO checks only (API flows are viewport-independent).
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /a11y\.spec\.ts/ },
  ],
});
