export type JourneyEventName =
  | "language_selected"
  | "concierge_started"
  | "service_selected"
  | "consultant_matches_viewed"
  | "consultant_profile_viewed"
  | "booking_clicked"
  | "contact_clicked";

export interface JourneyEventDetail {
  event: JourneyEventName;
  locale?: "en" | "fr" | "pt";
  serviceId?: string;
  consultantId?: string;
  resultCount?: number;
}

export function trackJourneyEvent(detail: JourneyEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<JourneyEventDetail>("iagc:journey", { detail }));
}
