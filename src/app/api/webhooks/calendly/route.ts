import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CALENDLY_API = "https://api.calendly.com";
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

type CalendlyWebhook = {
  event?: "invitee.created" | "invitee.canceled" | string;
  created_at?: string;
  payload?: {
    event?: string;
    invitee?: string;
    scheduled_event?: string;
    name?: string;
    email?: string;
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
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const actualBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function questionAnswer(answers: Array<{ question?: string; answer?: string }>, fragment: string): string | null {
  const match = answers.find(({ question }) => question?.toLowerCase().includes(fragment));
  return match?.answer?.trim() || null;
}

function eventId(uri: string | undefined): string | null {
  const value = uri?.split("/").pop();
  return value && /^[a-z0-9-]+$/i.test(value) ? value : null;
}

async function fetchInvitee(uri: string | undefined, token: string): Promise<CalendlyInvitee["resource"]> {
  if (!uri || !uri.startsWith(`${CALENDLY_API}/scheduled_events/`)) return undefined;
  const response = await fetch(uri, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  if (!response.ok) throw new Error("Calendly invitee lookup failed");
  return (await response.json() as CalendlyInvitee).resource;
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
  const invitee = payload?.invitee ? await fetchInvitee(payload.invitee, calendlyToken) : undefined;
  const scheduledEventId = eventId(payload?.scheduled_event ?? invitee?.scheduled_event ?? payload?.event);
  if (!scheduledEventId) return NextResponse.json({ error: "Missing scheduled event" }, { status: 400 });

  const supabase = createAdminClient();
  const answers = invitee?.questions_and_answers ?? [];
  const record = {
    calendly_event_id: scheduledEventId,
    calendly_invitee_uri: payload?.invitee ?? invitee?.uri ?? null,
    event_type_uri: payload?.event ?? null,
    name: invitee?.name ?? payload?.name ?? null,
    email: invitee?.email ?? payload?.email ?? null,
    address_and_phone: questionAnswer(answers, "full address and phone"),
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
  return NextResponse.json({ received: true });
}
