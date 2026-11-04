import "server-only";
import { Resend } from "resend";
import { site } from "@/content/site";
import { calLinkForLead } from "@/lib/integrations/cal";

/**
 * Email-only delivery. Every form submission is emailed to LEADS_INBOX with reply-to set to the submitter.
 * Transport: Resend when RESEND_API_KEY is set, otherwise SMTP via nodemailer (SMTP_HOST/PORT/USER/PASS,
 * e.g. Gmail with an app password). EMAIL_DRY_RUN=1 logs instead of sending (local dev / E2E only).
 */
export type Attachment = { filename: string; content: Buffer; contentType?: string };
type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string; attachments?: Attachment[] };

const env = () => ({
  resendKey: process.env.RESEND_API_KEY,
  smtpHost: process.env.SMTP_HOST,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  dryRun: process.env.EMAIL_DRY_RUN === "1" && (process.env.NODE_ENV !== "production" || process.env.ALLOW_EMAIL_DRY_RUN === "1"),
});

export function emailTransport(): "resend" | "smtp" | "dry-run" | null {
  const e = env();
  if (e.dryRun) return "dry-run";
  if (e.resendKey) return "resend";
  if (e.smtpHost && e.smtpUser && e.smtpPass) return "smtp";
  return null;
}

export const emailConfigured = () => emailTransport() !== null;
export const leadsInbox = () => process.env.LEADS_INBOX || process.env.SMTP_USER || site.email;
const from = () => process.env.EMAIL_FROM || (process.env.SMTP_USER ? `${site.name} <${process.env.SMTP_USER}>` : `${site.name} <${site.email}>`);

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const show = (v: unknown) => (Array.isArray(v) ? v.join(", ") : v instanceof Date ? v.toISOString() : String(v));

/** Renders every non-empty field as an HTML table + plain-text fallback. */
export function renderFields(title: string, fields: Record<string, unknown>) {
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0));
  const rows = entries
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555B6B;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(show(v))}</td></tr>`)
    .join("");
  return {
    html: `<h2 style="font-family:sans-serif">${esc(title)}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
    text: `${title}\n\n${entries.map(([k, v]) => `${k}: ${show(v)}`).join("\n")}`,
  };
}

let smtp: import("nodemailer").Transporter | undefined;
async function smtpTransport() {
  if (smtp) return smtp;
  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 465);
  smtp = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return smtp;
}

/** Sends one email. Returns true on success; never throws. */
export async function sendMail(m: Mail): Promise<boolean> {
  const transport = emailTransport();
  try {
    if (transport === "dry-run") {
      console.info(`[email:dry-run] to=${m.to} replyTo=${m.replyTo ?? "-"} subject=${m.subject} attachments=${m.attachments?.length ?? 0}`);
      return true;
    }
    if (transport === "resend") {
      const resend = new Resend(env().resendKey);
      const { error } = await resend.emails.send({
        from: from(), to: m.to, replyTo: m.replyTo, subject: m.subject, html: m.html, text: m.text,
        attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
      });
      if (error) console.error("[email] resend error", error.name);
      return !error;
    }
    if (transport === "smtp") {
      await (await smtpTransport()).sendMail({ from: from(), to: m.to, replyTo: m.replyTo, subject: m.subject, html: m.html, text: m.text, attachments: m.attachments });
      return true;
    }
  } catch (err) {
    console.error("[email] send failed", err instanceof Error ? err.message : err);
  }
  return false;
}

/** Notification to the team inbox; reply-to is the submitter so "Reply" goes straight to them. */
export async function notifyInbox(subject: string, title: string, fields: Record<string, unknown>, replyTo?: string, attachments?: Attachment[]) {
  const body = renderFields(title, fields);
  return sendMail({ to: leadsInbox(), subject, ...body, replyTo, attachments });
}

/** Courtesy auto-reply to the person who submitted a brief (best effort). */
export async function sendLeadAutoReply(to: string, name: string): Promise<boolean> {
  const cal = site.calUrl ? calLinkForLead(site.calUrl, { name, email: to }) : undefined;
  const first = esc(name.split(" ")[0] ?? name);
  return sendMail({
    to,
    replyTo: leadsInbox(),
    subject: "We've got your brief. Let's talk",
    text: `Hi ${name.split(" ")[0] ?? name},\n\nThanks for reaching out to ${site.name}. A senior consultant will review your brief and reply personally.\n\nThe team at ${site.name}`,
    html: `<div style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#383E4E;max-width:560px">
<p>Hi ${first},</p>
<p>Thanks for reaching out to ${site.name}. A senior consultant will review your brief and reply personally.</p>
${cal ? `<p>Want to move faster? <a href="${esc(cal)}" style="color:#383E4E;font-weight:600">Book a 30-minute discovery call</a>.</p>` : `<p>Prefer to talk? Call us on ${site.phone}.</p>`}
<p>The team at ${site.name}<br>${site.address.street}, ${site.address.locality}</p></div>`,
  });
}
