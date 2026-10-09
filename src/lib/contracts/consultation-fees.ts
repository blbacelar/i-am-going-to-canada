import { consultants } from "@/lib/content/data";

export type ConsultationDuration = 30 | 60;

export type ContractFee = {
  duration: ConsultationDuration;
  display: string;
};

const FEES: Record<ConsultationDuration, string> = {
  30: "CA$150.00",
  60: "CA$200.00",
};

const approvedEventDurations = new Map<string, ConsultationDuration>();

for (const consultant of consultants) {
  for (const [duration, appointment] of Object.entries(consultant.calendlyAppointments)) {
    if (appointment.eventTypeUri !== "TODO_CONTENT") {
      approvedEventDurations.set(appointment.eventTypeUri, Number(duration) as ConsultationDuration);
    }
  }
}

function scheduledDuration(startTime: string | undefined, endTime: string | undefined): ConsultationDuration | null {
  if (!startTime || !endTime) return null;
  const elapsedMinutes = (Date.parse(endTime) - Date.parse(startTime)) / 60_000;
  return elapsedMinutes === 30 || elapsedMinutes === 60 ? elapsedMinutes : null;
}

/**
 * Returns contractual terms only for production event types explicitly exposed
 * by the site's consultant data. Test, legacy and unknown Calendly events fail
 * closed and must never trigger a client contract.
 */
export function getContractFee(
  eventTypeUri: string | null,
  startTime: string | undefined,
  endTime: string | undefined,
): ContractFee | null {
  if (!eventTypeUri) return null;
  const configuredDuration = approvedEventDurations.get(eventTypeUri);
  const bookingDuration = scheduledDuration(startTime, endTime);
  if (!configuredDuration || configuredDuration !== bookingDuration) return null;

  return { duration: configuredDuration, display: FEES[configuredDuration] };
}
