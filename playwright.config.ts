import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3000", contextOptions: { reducedMotion: "reduce" } },
  webServer: process.env.BASE_URL ? undefined : { command: "npm run start", port: 3000, reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
