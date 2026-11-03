/** Env for the E2E server only (never real). Email is logged, not sent. Shared by playwright.config and specs. */
export const E2E = {
  port: 3100,
  env: {
    EMAIL_DRY_RUN: "1",
    ALLOW_EMAIL_DRY_RUN: "1",
    LEADS_INBOX: "leads@example.com",
    SANITY_REVALIDATE_SECRET: "e2e-revalidate-secret",
  },
} as const;
