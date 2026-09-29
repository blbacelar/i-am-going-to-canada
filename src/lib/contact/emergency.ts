import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(1000),
  website: z.string().max(0).optional(),
});

export type EmergencyContactRequest = z.infer<typeof emergencyContactSchema>;

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

export function renderEmergencyContactEmail(input: EmergencyContactRequest) {
  const name = escapeEmailHtml(input.name);
  const email = escapeEmailHtml(input.email);
  const message = escapeEmailHtml(input.message).replace(/\n/g, "<br>");

  return `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#182338"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f6f8;padding:28px 12px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border:1px solid #e3e6eb"><tr><td style="padding:20px 28px;border-bottom:3px solid #b4233a;font-size:19px;font-weight:700">Emergency consultation request</td></tr><tr><td style="padding:28px"><p style="margin:0 0 10px"><strong>Name:</strong> ${name}</p><p style="margin:0 0 20px"><strong>Email:</strong> ${email}</p><p style="margin:0 0 8px"><strong>Message:</strong></p><p style="margin:0;line-height:1.55">${message}</p></td></tr></table></td></tr></table></body></html>`;
}
