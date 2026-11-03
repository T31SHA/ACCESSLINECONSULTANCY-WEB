/** Env for the E2E server only (never real secrets). Shared by playwright.config and specs. */
export const E2E = {
  port: 3100,
  /** Emails are written here as JSON instead of being sent (see src/lib/server/email.ts). */
  outbox: ".email-outbox-e2e",
  env: {
    EMAIL_TEST_OUTBOX: ".email-outbox-e2e",
    LEADS_INBOX: "leads@example.com",
    SANITY_REVALIDATE_SECRET: "e2e-revalidate-secret",
  },
} as const;
