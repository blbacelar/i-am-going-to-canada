import { escapeHtml } from "@/lib/test/mock-booking";

export const COMPLETED_CONTRACT_RECIPIENT = "info@iamgoingtocanada.ca";

export type CompletedContractNotification = {
  clientName: string;
  clientEmail: string;
  clientContact?: string | null;
  scheduledAt: string;
};

export function formatScheduledAppointment(scheduledAt: string) {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.valueOf())) throw new Error("Invalid Calendly appointment date");
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Vancouver",
  }).format(date);
}

/** Internal confirmation sent only after SignWell marks the document completed. */
export function renderCompletedContractEmail(input: CompletedContractNotification) {
  const appointment = formatScheduledAppointment(input.scheduledAt);
  const contact = input.clientContact?.trim() || "Not provided";
  return {
    subject: `Signed consultation agreement — ${input.clientName}`,
    html: `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#182338"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f6f8;padding:28px 12px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border:1px solid #e3e6eb"><tr><td style="padding:24px 32px;border-bottom:3px solid #b4233a"><strong style="font-size:20px">I Am Going To Canada</strong><br><span style="color:#b4233a;font-size:12px;letter-spacing:1px">SIGNED CONSULTATION AGREEMENT</span></td></tr><tr><td style="padding:28px 32px"><p style="margin:0 0 18px;line-height:1.55">A client has completed and signed a consultation agreement.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tr><td style="padding:9px 0;border-top:1px solid #e3e6eb;font-weight:700;width:38%">Client</td><td style="padding:9px 0;border-top:1px solid #e3e6eb">${escapeHtml(input.clientName)}</td></tr><tr><td style="padding:9px 0;border-top:1px solid #e3e6eb;font-weight:700">Email</td><td style="padding:9px 0;border-top:1px solid #e3e6eb">${escapeHtml(input.clientEmail)}</td></tr><tr><td style="padding:9px 0;border-top:1px solid #e3e6eb;font-weight:700">Contact details</td><td style="padding:9px 0;border-top:1px solid #e3e6eb">${escapeHtml(contact)}</td></tr><tr><td style="padding:9px 0;border-top:1px solid #e3e6eb;font-weight:700">Appointment</td><td style="padding:9px 0;border-top:1px solid #e3e6eb">${escapeHtml(appointment)} (Vancouver time)</td></tr></table></td></tr><tr><td style="padding:18px 32px;border-top:1px solid #e3e6eb;color:#6b7280;font-size:12px;line-height:1.5">This is an automated internal confirmation. The signed PDF is archived in Dropbox.</td></tr></table></td></tr></table></body></html>`,
  };
}
