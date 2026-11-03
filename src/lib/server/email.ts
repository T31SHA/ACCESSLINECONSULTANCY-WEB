import "server-only";
import { Resend } from "resend";
import { site } from "@/content/site";
import { calLinkForLead } from "@/lib/integrations/cal";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const emailConfigured = Boolean(resend || process.env.SLACK_WEBHOOK_URL);
const FROM = process.env.EMAIL_FROM || `${site.name} <${site.email}>`;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendLeadNotification(lead: Record<string, unknown>) {
  const rows = Object.entries(lead)
    .filter(([, v]) => v !== undefined && v !== "" && v !== null)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4A5550">${esc(k)}</td><td>${esc(Array.isArray(v) ? v.join(", ") : String(v))}</td></tr>`)
    .join("");
  const html = `<h2 style="font-family:sans-serif">New lead</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`;
  const tasks: Promise<unknown>[] = [];
  if (resend) {
    tasks.push(resend.emails.send({
      from: FROM,
      to: process.env.LEADS_INBOX || site.email,
      replyTo: typeof lead.email === "string" ? lead.email : undefined,
      subject: `New enquiry — ${String(lead.organisation ?? lead.fullName ?? "website")}`,
      html,
    }));
  }
  if (process.env.SLACK_WEBHOOK_URL) {
    tasks.push(fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: `:sparkles: New lead: *${lead.fullName}* (${lead.organisation ?? "—"}) — ${lead.email}` }),
    }));
  }
  await Promise.allSettled(tasks);
}

/** Returns true only if an email was actually handed to Resend. */
export async function sendLeadAutoReply(to: string, name: string, leadId?: string): Promise<boolean> {
  if (!resend) return false;
  const cal = site.calUrl ? calLinkForLead(site.calUrl, { id: leadId, name, email: to }) : undefined;
  const first = esc(name.split(" ")[0] ?? name);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "We've got your brief — let's talk",
    html: `<div style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#0B1A13;max-width:560px">
<p>Hi ${first},</p>
<p>Thanks for reaching out to ${site.name}. A senior consultant will review your brief and reply personally.</p>
${cal ? `<p>Want to move faster? <a href="${esc(cal)}" style="color:#014F29;font-weight:600">Book a 30-minute discovery call</a>.</p>` : `<p>Prefer to talk? Call us on ${site.phone}.</p>`}
<p>— The team at ${site.name}<br>${site.address.street}, ${site.address.locality}</p></div>`,
  });
  return !error;
}

export const newsletterConfirmUrl = (token: string) => `${site.url}/newsletter/confirm?token=${encodeURIComponent(token)}`;

/** Double opt-in email. Without Resend the link is logged in development so the flow stays testable. */
export async function sendNewsletterConfirmation(to: string, token: string): Promise<boolean> {
  const url = newsletterConfirmUrl(token);
  if (!resend) {
    if (process.env.NODE_ENV !== "production") console.info(`[newsletter] confirm link for ${to}: ${url}`);
    return false;
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Confirm your subscription",
    html: `<div style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#0B1A13;max-width:560px">
<p>One click to confirm you'd like monthly insights from ${site.name}.</p>
<p><a href="${esc(url)}" style="display:inline-block;background:#014F29;color:#F7F4EE;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Confirm subscription</a></p>
<p style="color:#4A5550;font-size:14px">Didn't ask for this? Ignore this email and you won't be subscribed.</p></div>`,
  });
  return !error;
}
