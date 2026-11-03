/** Secrets for the E2E server only (never real). Shared by playwright.config and specs. */
export const E2E = {
  port: 3100,
  admin: { email: "admin@example.com", password: "e2e-correct-horse-battery" },
  env: {
    DATABASE_URL: "pglite://.pglite-e2e",
    AUTH_SECRET: "e2e-auth-secret-0123456789abcdef0123456789",
    ADMIN_EMAILS: "admin@example.com,ops@example.com",
    ADMIN_PASSWORD: "e2e-correct-horse-battery",
    SANITY_REVALIDATE_SECRET: "e2e-revalidate-secret",
    CAL_WEBHOOK_SECRET: "e2e-cal-secret",
    CRON_SECRET: "e2e-cron-secret",
    E2E_EXPOSE_TOKENS: "1",
  },
} as const;
