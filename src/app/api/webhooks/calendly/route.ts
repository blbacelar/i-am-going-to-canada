import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createContractPdf } from "@/app/api/test/mock-booking/route";
import { renderContractEmail } from "@/lib/email/contract-email";

const CALENDLY_API = "https://api.calendly.com";
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;
const SIGNWELL_API = "https://www.signwell.com/api/v1/documents";

type CalendlyWebhook = {
  event?: "invitee.created" | "invitee.canceled" | string;
  created_at?: string;
  payload?: {
    event?: string;
    invitee?: string;
    scheduled_event?: string;
    name?: string;
    email?: string;
    tracking?: { utm_content?: string };
  };
};

type CalendlyInvitee = {
  resource?: {
    name?: string;
    email?: string;
    questions_and_answers?: Array<{ question?: string; answer?: string }>;
    uri?: string;
    scheduled_event?: string;
  };
};

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const values = new Map(header.split(",").map((part) => {
    const [key, value] = part.trim().split("=", 2);
    return [key, value] as const;
  }));
  const timestamp = values.get("t");
  const signature = values.get("v1");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  const timestampNumber = Number(timestamp);
  const timestampSeconds = timestampNumber > 10_000_000_000 ? timestampNumber / 1000 : timestampNumber;
  if (Math.abs(Date.now() / 1000 - timestampSeconds) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expectedBuffer = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest();
  const candidates = [
    Buffer.from(signature, "hex"),
    Buffer.from(signature, "base64"),
    Buffer.from(signature.replace(/-/g, "+").replace(/_/g, "/"), "base64"),
  ];
  return candidates.some((actualBuffer) => actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer));
}

function questionAnswer(answers: Array<{ question?: string; answer?: string }>, fragment: string): string | null {
  const match = answers.find(({ question }) => question?.toLowerCase().includes(fragment));
  return match?.answer?.trim() || null;
}

function contactAnswer(answers: Array<{ question?: string; answer?: string }>): string | null {
  return answers.find(({ question, answer }) => {
    const text = question?.toLowerCase() || "";
    return Boolean(answer?.trim()) && ((text.includes("address") || text.includes("endereço") || text.includes("direccion")) && (text.includes("phone") || text.includes("telefone") || text.includes("teléfono")));
  })?.answer?.trim() || questionAnswer(answers, "full address and phone") || answers.find(({ question, answer }) => Boolean(answer?.trim()) && ((question?.toLowerCase().includes("address")) || question?.toLowerCase().includes("endereço") || question?.toLowerCase().includes("direccion")))?.answer?.trim() || answers.find(({ answer }) => Boolean(answer?.trim()))?.answer?.trim() || null;
}

function eventId(uri: string | { uri?: string } | undefined): string | null {
  const normalizedUri = typeof uri === "string" ? uri : uri?.uri;
  const value = normalizedUri?.split("/").pop();
  return value && /^[a-z0-9-]+$/i.test(value) ? value : null;
}

async function fetchInvitee(uri: string | undefined, token: string): Promise<CalendlyInvitee["resource"]> {
  if (!uri || !uri.startsWith(`${CALENDLY_API}/invitees/`)) return undefined;
  const response = await fetch(uri, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  if (!response.ok) throw new Error("Calendly invitee lookup failed");
  return (await response.json() as CalendlyInvitee).resource;
}

async function fetchInviteeForEvent(eventIdValue: string | null, token: string, email?: string) {
  if (!eventIdValue) return undefined;
  const response = await fetch(`${CALENDLY_API}/scheduled_events/${eventIdValue}/invitees`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  if (!response.ok) return undefined;
  const body = await response.json() as { collection?: Array<CalendlyInvitee["resource"]> };
  return body.collection?.find((item) => !email || item?.email === email) ?? body.collection?.[0];
}

async function sendContractEmail(record: { name: string; email: string; address_and_phone: string | null; preparation_notes: string | null }, language: string) {
  const signwellKey = process.env.SIGNWELL_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!signwellKey || !resendKey || !from) return;
  const consultantName = process.env.MOCK_CONSULTANT_NAME || "TODO_CONTENT";
  const consultantRcic = process.env.MOCK_CONSULTANT_RCIC || "TODO_CONTENT";
  const consultantContact = process.env.MOCK_CONSULTANT_CONTACT || "TODO_CONTENT";
  const testMode = process.env.SIGNWELL_TEST_MODE !== "false";
  const signerEmail = testMode ? (process.env.SIGNWELL_TEST_RECIPIENT || record.email) : record.email;
  const contractLanguage = language === "en" || language === "fr" || language === "es-fr" || language === "pt-fr" ? language : "pt-fr";
  const pdf = await createContractPdf({ name: record.name, email: record.email, addressAndPhone: record.address_and_phone || "TODO_CONTENT", preparationNotes: record.preparation_notes || "", fee: process.env.MOCK_CONSULTATION_FEE || "TODO_CONTENT" }, consultantName, consultantRcic, consultantContact, contractLanguage);
  const signwellResponse = await fetch(SIGNWELL_API, { method: "POST", headers: { "X-Api-Key": signwellKey, "Content-Type": "application/json" }, body: JSON.stringify({
    test_mode: testMode,
    files: [{ name: "consultation-agreement.pdf", file_base64: Buffer.from(pdf).toString("base64") }],
    name: `Consultation agreement — ${record.name}`,
    subject: "Please review and sign your consultation agreement",
    message: "Please review and sign this consultation agreement.",
    recipients: [{ id: "1", name: record.name, email: signerEmail }],
    fields: [[
      { type: "signature", api_id: "client_signature", required: true, recipient_id: "1", page: 1, x: 72, y: 600, width: 220, height: 32 },
      { type: "date", api_id: "signed_date", required: true, recipient_id: "1", page: 1, x: 440, y: 600, width: 120, height: 32 },
    ]],
    metadata: { calendly_event_id: record.email },
    language: contractLanguage === "pt-fr" ? "pt" : contractLanguage === "es-fr" ? "es" : contractLanguage,
  }) });
  const body = await signwellResponse.json().catch(() => null) as { id?: string; recipients?: Array<{ signing_url?: string; embedded_signing_url?: string }>; error?: string } | null;
  const signingUrl = body?.recipients?.[0]?.signing_url || body?.recipients?.[0]?.embedded_signing_url;
  if (!signwellResponse.ok || !body?.id || !signingUrl) throw new Error(`SignWell contract creation failed: ${body?.error || `HTTP ${signwellResponse.status}`}`);
  const emailCopy = await renderContractEmail({ name: record.name, signingUrl, language: contractLanguage, testMode });
  const emailRecipient = testMode ? (process.env.RESEND_TEST_RECIPIENT || record.email) : record.email;
  const email = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [emailRecipient], subject: emailCopy.subject, html: emailCopy.html, attachments: emailCopy.attachments }) });
  if (!email.ok) throw new Error("Resend contract email failed");
}

export async function POST(request: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  const calendlyToken = process.env.CALENDLY_PAT_TOKEN;
  if (!signingKey || !calendlyToken) return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("calendly-webhook-signature"), signingKey)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let body: CalendlyWebhook;
  try {
    body = JSON.parse(rawBody) as CalendlyWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.event !== "invitee.created" && body.event !== "invitee.canceled") return NextResponse.json({ received: true });

  const payload = body.payload;
  let scheduledEventId = eventId(payload?.scheduled_event ?? payload?.event);
  const invitee = (payload?.invitee ? await fetchInvitee(payload.invitee, calendlyToken) : undefined) ?? await fetchInviteeForEvent(scheduledEventId, calendlyToken, payload?.email);
  scheduledEventId ??= eventId(invitee?.scheduled_event);
  if (!scheduledEventId) return NextResponse.json({ error: "Missing scheduled event" }, { status: 400 });

  const supabase = createAdminClient();
  const answers = invitee?.questions_and_answers ?? [];
  const record = {
    calendly_event_id: scheduledEventId,
    calendly_invitee_uri: payload?.invitee ?? invitee?.uri ?? null,
    event_type_uri: payload?.event ?? null,
    name: invitee?.name ?? payload?.name ?? null,
    email: invitee?.email ?? payload?.email ?? null,
    address_and_phone: contactAnswer(answers),
    preparation_notes: questionAnswer(answers, "prepare for our meeting"),
    status: body.event === "invitee.canceled" ? "canceled" : "booked",
    calendly_created_at: body.created_at ?? null,
  };
  if (!record.name || !record.email) return NextResponse.json({ error: "Missing invitee details" }, { status: 400 });

  const { error } = await supabase.from("crm_leads").upsert(record, { onConflict: "calendly_event_id" });
  if (error) {
    console.error("Calendly CRM persistence failed", { code: error.code });
    return NextResponse.json({ error: "Unable to persist booking" }, { status: 500 });
  }
  if (body.event === "invitee.created") {
    const requestedLanguage = payload?.tracking?.utm_content === "pt" ? "pt-fr" : payload?.tracking?.utm_content === "es" ? "es-fr" : payload?.tracking?.utm_content;
    try { await sendContractEmail({ name: record.name, email: record.email, address_and_phone: record.address_and_phone, preparation_notes: record.preparation_notes }, requestedLanguage || "pt-fr"); } catch (contractError) { console.error("Calendly contract dispatch failed", { error: contractError instanceof Error ? contractError.message : "unknown" }); }
  }
  return NextResponse.json({ received: true });
}
