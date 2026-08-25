import { NextResponse } from "next/server";
import { getActiveConsultants } from "@/lib/content/data";

const CALENDLY_API = "https://api.calendly.com";
const DAY_MS = 24 * 60 * 60 * 1000;

type AvailabilityResponse = {
  collection?: Array<{ start_time?: string }>;
};

function isEventTypeUri(value: string): boolean {
  return /^https:\/\/api\.calendly\.com\/event_types\/[a-z0-9-]+$/i.test(value);
}

export async function GET(request: Request) {
  const token = process.env.CALENDLY_PAT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Calendly availability is not configured" }, { status: 503 });
  }

  const ids = new Set(new URL(request.url).searchParams.get("consultantIds")?.split(",").filter(Boolean));
  const consultants = getActiveConsultants().filter((consultant) => ids.has(consultant.id));
  if (!consultants.length) return NextResponse.json({ availability: {} });

  const start = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const end = new Date(Date.now() + 14 * DAY_MS).toISOString();
  const availability = await Promise.all(consultants.map(async (consultant) => {
    const eventType = consultant.calendlyEventTypeUri;
    if (eventType === "TODO_CONTENT" || !isEventTypeUri(eventType)) {
      return [consultant.id, { firstAvailableAt: null, slotCount: 0 }] as const;
    }

    const params = new URLSearchParams({ event_type: eventType, start_time: start, end_time: end });
    try {
      const response = await fetch(`${CALENDLY_API}/event_type_available_times?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        next: { revalidate: 300 },
      });
      if (!response.ok) return [consultant.id, { firstAvailableAt: null, slotCount: 0 }] as const;
      const body = (await response.json()) as AvailabilityResponse;
      const slots = (body.collection ?? []).filter((slot) => slot.start_time).map((slot) => slot.start_time as string);
      return [consultant.id, { firstAvailableAt: slots[0] ?? null, slotCount: slots.length }] as const;
    } catch {
      return [consultant.id, { firstAvailableAt: null, slotCount: 0 }] as const;
    }
  }));

  return NextResponse.json({ availability: Object.fromEntries(availability), window: { start, end } }, {
    headers: { "Cache-Control": "private, max-age=300" },
  });
}
