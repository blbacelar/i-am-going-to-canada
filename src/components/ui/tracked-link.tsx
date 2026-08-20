"use client";

import type { ReactNode } from "react";
import { trackJourneyEvent, type JourneyEventDetail } from "@/lib/analytics/track";

export function TrackedExternalLink({
  href,
  event,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  event: JourneyEventDetail;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() => trackJourneyEvent(event)}
    >
      {children}
    </a>
  );
}
