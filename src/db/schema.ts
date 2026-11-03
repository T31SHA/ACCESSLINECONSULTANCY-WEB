import { sql } from "drizzle-orm";
import {
  boolean, customType, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid,
} from "drizzle-orm/pg-core";

/** citext requires: CREATE EXTENSION IF NOT EXISTS citext; (in migration 0000) */
const citext = customType<{ data: string }>({ dataType: () => "citext" });

export const userRole = pgEnum("user_role", ["admin", "editor", "sales"]);
export const budgetBand = pgEnum("budget_band", ["under_500k", "500k_2m", "2m_5m", "5m_plus", "undecided"]);
export const leadTimeline = pgEnum("lead_timeline", ["asap", "1_3_months", "3_6_months", "exploring"]);
export const leadStatus = pgEnum("lead_status", ["new", "contacted", "qualified", "proposal", "won", "lost", "spam"]);
export const leadEventType = pgEnum("lead_event_type", ["email_sent", "note", "status_change", "call_booked"]);
export const subscriberStatus = pgEnum("subscriber_status", ["pending", "confirmed", "unsubscribed"]);
export const applicationStatus = pgEnum("application_status", ["new", "reviewing", "shortlisted", "rejected", "hired"]);
export const bookingStatus = pgEnum("booking_status", ["scheduled", "rescheduled", "cancelled", "completed"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: citext("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRole("role").notNull().default("sales"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    fullName: text("full_name").notNull(),
    email: citext("email").notNull(),
    phone: text("phone"),
    organisation: text("organisation"),
    role: text("role"),
    country: text("country"),
    serviceInterest: text("service_interest").array().notNull().default(sql`'{}'::text[]`),
    industry: text("industry"),
    budgetBand: budgetBand("budget_band"),
    timeline: leadTimeline("timeline"),
    message: text("message"),
    sourcePage: text("source_page"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    referrer: text("referrer"),
    consentMarketing: boolean("consent_marketing").notNull().default(false),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    status: leadStatus("status").notNull().default("new"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    score: integer("score").notNull().default(0),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt.desc()),
    index("leads_status_idx").on(t.status),
    index("leads_email_idx").on(t.email),
  ],
);

export const leadEvents = pgTable(
  "lead_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    type: leadEventType("type").notNull(),
    payload: jsonb("payload").notNull().default({}),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("lead_events_lead_id_idx").on(t.leadId, t.createdAt)],
);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: citext("email").notNull().unique(),
  status: subscriberStatus("status").notNull().default("pending"),
  confirmToken: text("confirm_token"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobSlug: text("job_slug").notNull(),
    fullName: text("full_name").notNull(),
    email: citext("email").notNull(),
    phone: text("phone"),
    linkedinUrl: text("linkedin_url"),
    cvObjectKey: text("cv_object_key").notNull(),
    coverNote: text("cover_note"),
    status: applicationStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("job_applications_created_at_idx").on(t.createdAt)],
);

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  providerEventId: text("provider_event_id").notNull().unique(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  attendeeEmail: citext("attendee_email").notNull(),
  status: bookingStatus("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  diff: jsonb("diff"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
