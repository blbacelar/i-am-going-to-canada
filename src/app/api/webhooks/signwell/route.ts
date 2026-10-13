import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { DropboxRequestError, getDropboxAccessToken } from "@/lib/dropbox/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { COMPLETED_CONTRACT_RECIPIENT, renderCompletedContractEmail } from "@/lib/email/completed-contract-email";

const SIGNWELL_API = "https://www.signwell.com/api/v1/documents";
const DROPBOX_UPLOAD = "https://content.dropboxapi.com/2/files/upload";

type SignWellEvent = {
  event?: { type?: string; time?: number; hash?: string };
  data?: { object?: SignWellDocument };
};

type SignWellDocument = {
  id?: string;
  name?: string;
  status?: string;
  recipients?: Array<{ name?: string; email?: string }>;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

function safeFileName(value: string) {
  const normalized = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return normalized.slice(0, 100) || "client";
}

function fileTimestamp(unixSeconds: number | undefined) {
  const date = new Date((unixSeconds ?? Date.now() / 1000) * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date).reduce<Record<string, string>>((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}`;
}

function isValidEvent(event: SignWellEvent["event"], webhookId: string) {
  if (!event?.type || typeof event.time !== "number" || !event.hash) return false;
  if (Math.abs(Date.now() / 1000 - event.time) > 5 * 60) return false;
  const expected = Buffer.from(createHmac("sha256", webhookId).update(`${event.type}@${event.time}`).digest("hex"), "hex");
  const actual = Buffer.from(event.hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function metadataString(metadata: SignWellDocument["metadata"], key: string) {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function sendCompletionNotification(input: {
  clientName: string;
  clientEmail: string;
  clientContact: string | null;
  scheduledAt: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resendKey || !from) throw new Error("Resend confirmation email is not configured");
  const email = renderCompletedContractEmail(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [COMPLETED_CONTRACT_RECIPIENT], subject: email.subject, html: email.html }),
  });
  if (!response.ok) throw new Error(`Resend completion confirmation failed: HTTP ${response.status}`);
}

export async function POST(request: Request) {
  const signwellKey = process.env.SIGNWELL_API_KEY;
  const webhookId = process.env.SIGNWELL_WEBHOOK_ID;
  if (!signwellKey || !webhookId || !process.env.DROPBOX_APP_KEY || !process.env.DROPBOX_APP_SECRET || !process.env.DROPBOX_REFRESH_TOKEN) {
    return NextResponse.json({ error: "Signed document archival is not configured" }, { status: 503 });
  }
  const payload = await request.json().catch(() => null) as SignWellEvent | null;
  if (!payload || !isValidEvent(payload.event, webhookId)) return NextResponse.json({ error: "Invalid SignWell webhook" }, { status: 401 });
  if (payload.event?.type !== "document_completed") return NextResponse.json({ received: true });
  const id = payload.data?.object?.id;
  if (!id) return NextResponse.json({ error: "Missing document id" }, { status: 400 });

  try {
    const fileResponse = await fetch(`${SIGNWELL_API}/${encodeURIComponent(id)}/completed_pdf?audit_page=true&file_format=pdf`, { headers: { "X-Api-Key": signwellKey } });
    if (!fileResponse.ok) {
      console.error("SignWell archival failed", { stage: "download-pdf", status: fileResponse.status });
      return NextResponse.json({ error: "Signed document is not ready" }, { status: 502 });
    }
    const documentResponse = await fetch(`${SIGNWELL_API}/${encodeURIComponent(id)}`, { headers: { "X-Api-Key": signwellKey, Accept: "application/json" } });
    const document = documentResponse.ok ? await documentResponse.json().catch(() => null) as SignWellDocument | null : null;
    const clientName = document?.recipients?.[0]?.name?.trim() || payload.data?.object?.recipients?.[0]?.name?.trim() || "client";
    const basePath = process.env.DROPBOX_CONTRACTS_PATH || "/Signed Contracts";
    const path = `${basePath.replace(/\/$/, "")}/${safeFileName(clientName)}-${fileTimestamp(payload.event?.time)}.pdf`;
    const accessToken = await getDropboxAccessToken();
    const uploadHeaders = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({ path, mode: "add", autorename: true, mute: true }),
    };
    const upload = await fetch(DROPBOX_UPLOAD, {
      method: "POST",
      headers: uploadHeaders,
      body: await fileResponse.arrayBuffer(),
    });
    if (!upload.ok) {
      console.error("SignWell archival failed", { stage: "dropbox-upload", status: upload.status, requestId: upload.headers.get("x-dropbox-request-id") });
      return NextResponse.json({ error: "Dropbox upload failed" }, { status: 502 });
    }

    const eventDocument = document ?? payload.data?.object;
    const calendlyEventId = metadataString(eventDocument?.metadata, "calendly_event_id");
    const scheduledAt = metadataString(eventDocument?.metadata, "calendly_scheduled_at");
    const clientEmail = metadataString(eventDocument?.metadata, "client_email") || document?.recipients?.[0]?.email?.trim() || payload.data?.object?.recipients?.[0]?.email?.trim() || null;
    const confirmationClientName = metadataString(eventDocument?.metadata, "client_name") || clientName;
    if (!clientEmail || !scheduledAt) {
      console.error("Signed contract confirmation skipped because its booking metadata is incomplete", { documentId: id, hasCalendlyEventId: Boolean(calendlyEventId), hasClientEmail: Boolean(clientEmail), hasScheduledAt: Boolean(scheduledAt) });
      return NextResponse.json({ error: "Signed contract confirmation metadata is incomplete" }, { status: 502 });
    }

    let notificationAlreadySent = false;
    let clientContact: string | null = null;
    const supabase = createAdminClient();
    if (calendlyEventId) {
      const { data: lead, error: leadError } = await supabase
        .from("crm_leads")
        .select("address_and_phone, contract_completion_notified_at")
        .eq("calendly_event_id", calendlyEventId)
        .maybeSingle();
      if (leadError) throw new Error(`Signed contract notification lookup failed: ${leadError.code}`);
      notificationAlreadySent = Boolean(lead?.contract_completion_notified_at);
      clientContact = lead?.address_and_phone ?? null;
    }
    if (!notificationAlreadySent) {
      await sendCompletionNotification({ clientName: confirmationClientName, clientEmail, clientContact, scheduledAt });
      if (calendlyEventId) {
        const { error: updateError } = await supabase
          .from("crm_leads")
          .update({ contract_completed_at: new Date((payload.event?.time ?? Date.now() / 1000) * 1000).toISOString(), contract_completion_notified_at: new Date().toISOString() })
          .eq("calendly_event_id", calendlyEventId);
        if (updateError) throw new Error(`Signed contract notification tracking failed: ${updateError.code}`);
      }
    }
  } catch (error) {
    const status = error instanceof DropboxRequestError ? error.status : undefined;
    console.error("Signed contract completion handling failed", { status, error: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Signed contract handling failed" }, { status: 502 });
  }
  return NextResponse.json({ received: true, archived: true, completionNotificationSent: true });
}
