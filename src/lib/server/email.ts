import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";
import { site } from "@/content/site";

/**
 * Every form on the site ends up here: one email to LEADS_INBOX, reply-to = the person who submitted.
 *
 * Transport, picked at call time (so env changes / test stubs apply without a rebuild):
 *   1. EMAIL_TEST_OUTBOX=<dir>  → writes each message as JSON to <dir> (E2E/local only, never in production)
 *   2. RESEND_API_KEY           → Resend HTTP API
 *   3. SMTP_HOST (+PORT/USER/PASS) → SMTP via nodemailer (e.g. Hostinger: smtp.hostinger.com:465)
 */

export type MailAttachment = { filename: string; content: Buffer; contentType: string };
export type Mail = {
  subject: string;
  /** Submitter's address; replies from the inbox go straight to them. */
  replyTo?: string;
  text: string;
  html: string;
  attachments?: MailAttachment[];
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("Email is not configured: set RESEND_API_KEY or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.");
    this.name = "EmailNotConfiguredError";
  }
}

type Transport = "outbox" | "resend" | "smtp";

function transport(): Transport | null {
  if (process.env.EMAIL_TEST_OUTBOX) return "outbox";
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST) return "smtp";
  return null;
}

export const emailConfigured = () => transport() !== null;

export const leadsInbox = () => process.env.LEADS_INBOX || site.email;

function fromAddress(t: Transport) {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  // Most SMTP hosts (Hostinger included) reject a From that isn't the authenticated mailbox.
  if (t === "smtp" && process.env.SMTP_USER?.includes("@")) return `${site.name} <${process.env.SMTP_USER}>`;
  return `${site.name} <${site.email}>`;
}

/** Header values must be single-line. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim().slice(0, 200);

let smtp: { key: string; transporter: Transporter } | undefined;
function smtpTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const key = `${process.env.SMTP_HOST}:${port}:${user}`;
  if (smtp?.key !== key) {
    smtp = {
      key,
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
        auth: user ? { user, pass: process.env.SMTP_PASS ?? "" } : undefined,
      }),
    };
  }
  return smtp.transporter;
}

/** Sends one message to LEADS_INBOX. Throws EmailNotConfiguredError, or the provider's error on failure. */
export async function sendMail(mail: Mail): Promise<void> {
  const t = transport();
  if (!t) throw new EmailNotConfiguredError();
  const to = leadsInbox();
  const from = fromAddress(t);
  const subject = oneLine(mail.subject);
  const attachments = mail.attachments ?? [];

  if (t === "outbox") {
    const dir = path.resolve(process.env.EMAIL_TEST_OUTBOX!);
    await mkdir(dir, { recursive: true });
    const record = {
      from, to, replyTo: mail.replyTo, subject, text: mail.text, html: mail.html,
      attachments: attachments.map((a) => ({ filename: a.filename, contentType: a.contentType, size: a.content.length })),
    };
    await writeFile(path.join(dir, `${Date.now()}-${randomUUID()}.json`), JSON.stringify(record, null, 2));
    return;
  }

  if (t === "resend") {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from, to, subject, replyTo: mail.replyTo, text: mail.text, html: mail.html,
      attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
    });
    if (error) throw new Error(`Resend: ${error.message}`);
    return;
  }

  await smtpTransporter().sendMail({
    from, to, subject, replyTo: mail.replyTo, text: mail.text, html: mail.html,
    attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
  });
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type Fields = [label: string, value: unknown][];

const show = (v: unknown) => (Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v));

/** Renders labelled fields as a plain-text + HTML table body. Empty values are skipped. */
export function renderFields(title: string, fields: Fields): Pick<Mail, "text" | "html"> {
  const rows = fields.filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0));
  const text = `${title}\n\n${rows.map(([k, v]) => `${k}: ${show(v)}`).join("\n")}\n`;
  const html = `<h2 style="font-family:sans-serif">${esc(title)}</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4A5550;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${esc(show(v))}</td></tr>`)
    .join("")}</table>`;
  return { text, html };
}
