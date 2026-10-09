"use client";

import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";

export const conciergeRestartEvent = "iamgoingtocanada:restart-concierge";
const conciergeRestartStorageKey = "iamgoingtocanada:restart-concierge";

export function requestConciergeRestart() {
  window.sessionStorage.setItem(conciergeRestartStorageKey, "true");
  window.dispatchEvent(new Event(conciergeRestartEvent));
}

export function consumeConciergeRestartRequest(): boolean {
  const requested = window.sessionStorage.getItem(conciergeRestartStorageKey) === "true";
  if (requested) window.sessionStorage.removeItem(conciergeRestartStorageKey);
  return requested;
}

export function FindAppointmentLink({ children, onClick, ...props }: ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) requestConciergeRestart();
      }}
    >
      {children}
    </Link>
  );
}
