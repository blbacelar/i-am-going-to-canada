"use client";

import { useEffect } from "react";
import { trackJourneyEvent } from "@/lib/analytics/track";
import type { Locale } from "@/lib/i18n/config";

export function ProfileViewTracker({ locale, consultantId }: { locale: Locale; consultantId: string }) {
  useEffect(() => {
    trackJourneyEvent({ event: "consultant_profile_viewed", locale, consultantId });
  }, [consultantId, locale]);
  return null;
}
