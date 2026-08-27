import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

const SIGNWELL_API = "https://www.signwell.com/api/v1/documents";
const DROPBOX_UPLOAD = "https://content.dropboxapi.com/2/files/upload";

type SignWellEvent = {
  event?: { type?: string; time?: number; hash?: string };
  data?: { object?: { id?: string; name?: string; status?: string; recipients?: Array<{ name?: string; email?: string }> } };
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

export async function POST(request: Request) {
  const signwellKey = process.env.SIGNWELL_API_KEY;
  const dropboxToken = process.env.DROPBOX_ACCESS_TOKEN;
  const webhookId = process.env.SIGNWELL_WEBHOOK_ID;
  if (!signwellKey || !dropboxToken || !webhookId) return NextResponse.json({ error: "Signed document archival is not configured" }, { status: 503 });
  const payload = await request.json().catch(() => null) as SignWellEvent | null;
  if (!payload || !isValidEvent(payload.event, webhookId)) return NextResponse.json({ error: "Invalid SignWell webhook" }, { status: 401 });
  if (payload.event?.type !== "document_completed") return NextResponse.json({ received: true });
  const id = payload.data?.object?.id;
  if (!id) return NextResponse.json({ error: "Missing document id" }, { status: 400 });

  const fileResponse = await fetch(`${SIGNWELL_API}/${encodeURIComponent(id)}/completed_pdf?audit_page=true&file_format=pdf`, { headers: { "X-Api-Key": signwellKey } });
  if (!fileResponse.ok) return NextResponse.json({ error: "Signed document is not ready" }, { status: 502 });
  const documentResponse = await fetch(`${SIGNWELL_API}/${encodeURIComponent(id)}`, { headers: { "X-Api-Key": signwellKey, Accept: "application/json" } });
  const document = await documentResponse.json().catch(() => null) as { recipients?: Array<{ name?: string; email?: string }> } | null;
  const clientName = document?.recipients?.[0]?.name?.trim() || payload.data?.object?.recipients?.[0]?.name?.trim() || "client";
  const basePath = process.env.DROPBOX_CONTRACTS_PATH || "/Signed Contracts";
  const path = `${basePath.replace(/\/$/, "")}/${safeFileName(clientName)}-${fileTimestamp(payload.event?.time)}.pdf`;
  const upload = await fetch(DROPBOX_UPLOAD, { method: "POST", headers: { Authorization: `Bearer ${dropboxToken}`, "Content-Type": "application/octet-stream", "Dropbox-API-Arg": JSON.stringify({ path, mode: "add", autorename: true, mute: true }) }, body: await fileResponse.arrayBuffer() });
  if (!upload.ok) return NextResponse.json({ error: "Dropbox upload failed" }, { status: 502 });
  return NextResponse.json({ received: true, archived: true });
}
