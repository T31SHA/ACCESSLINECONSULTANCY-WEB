/** Booking link pre-filled with the visitor's name and email. */
export function calLinkForLead(calUrl: string, lead: { name: string; email: string }) {
  const u = new URL(calUrl);
  u.searchParams.set("name", lead.name);
  u.searchParams.set("email", lead.email);
  return u.toString();
}
