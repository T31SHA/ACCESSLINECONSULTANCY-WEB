import "server-only";
import { Resend } from "resend";
import { site } from "@/content/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? `Accessline Consultancy Limited <info@accesslineconsultancy.com>`;

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
      to: process.env.LEADS_INBOX ?? site.email,
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
export async function sendLeadAutoReply(to: string, name: string): Promise<boolean> {
  if (!resend) return false;
  const first = esc(name.split(" ")[0] ?? name);
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "We've got your brief — let's talk",
    html: `<div style="font-family:sans-serif;font-size:16px;line-height:1.6;color:#0B1A13;max-width:560px">
<p>Hi ${first},</p>
<p>Thanks for reaching out to ${site.name}. A senior consultant will review your brief and reply personally.</p>
${site.calUrl ? `<p>Want to move faster? <a href="${site.calUrl}" style="color:#014F29;font-weight:600">Book a 30-minute discovery call</a>.</p>` : `<p>Prefer to talk? Call us on ${site.phone}.</p>`}
<p>— The team at ${site.name}<br>${site.address.street}, ${site.address.locality}</p></div>`,
  });
  return !error;
}
