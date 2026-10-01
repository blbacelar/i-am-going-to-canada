import { NextResponse } from "next/server";
import { emergencyContactSchema, renderEmergencyContactEmail } from "@/lib/contact/emergency";

const RESEND_API = "https://api.resend.com/emails";
const DESTINATION = process.env.EMERGENCY_CONTACT_RECIPIENT
  || (process.env.NODE_ENV === "development" ? "blbacelar@gmail.com" : "info@iamgoingtocanada.ca");
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 4;
const attempts = new Map<string, number[]>();

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) return true;
  recent.push(now);
  attempts.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = emergencyContactSchema.safeParse(body);
  if (!parsed.success || parsed.data.website) {
    return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resendKey || !from) {
    console.error("Emergency contact email is not configured");
    return NextResponse.json({ error: "Email is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const input = parsed.data;
  const response = await fetch(RESEND_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [DESTINATION],
      reply_to: input.email,
      subject: "Emergency consultation request",
      text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
      html: renderEmergencyContactEmail(input),
    }),
  });

  if (!response.ok) {
    const providerError = await response.json().catch(() => null) as { message?: string; name?: string } | null;
    console.error("Emergency contact email failed", {
      status: response.status,
      message: providerError?.message ?? providerError?.name ?? "unknown",
    });
    return NextResponse.json({ error: "Email is temporarily unavailable. Please try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
