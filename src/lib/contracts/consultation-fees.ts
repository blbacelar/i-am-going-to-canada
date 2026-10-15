import { consultants } from "@/lib/content/data";

export type ConsultationDuration = 15 | 30 | 60 | 75;

export type ContractFee = {
  duration: ConsultationDuration;
  display: string;
};

const FEES: Record<ConsultationDuration, string> = {
  15: "CA$85.00",
  30: "CA$150.00",
  60: "CA$200.00",
  75: "CA$300.00",
};

type ContractFeeRule = ContractFee & { eventTypeUri: string };

/**
 * Events available only from a consultant's direct Calendly profile. Their fees are
 * intentionally listed by exact event type because equal durations do not
 * always have equal fees (for example, a temporary-residence review).
 */
const directCalendlyFeeRules: ContractFeeRule[] = [
  // Marina Snyder
  { eventTypeUri: "https://api.calendly.com/event_types/b1e06f07-48cf-4f61-b110-e2fefecb1e6a", duration: 15, display: "CA$85.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/39fa4ed6-5d5e-4688-b41a-490933de1d81", duration: 75, display: "CA$300.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/3e1b94a3-d35f-4f3e-ae18-50b0aaaba554", duration: 60, display: "CA$300.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/ddc7943c-2092-44bf-85a6-80329c5805a7", duration: 60, display: "CA$150.00" },
  // Virginia Melo
  { eventTypeUri: "https://api.calendly.com/event_types/eb4bc98a-ee31-42fd-86fc-f84b44e54e7c", duration: 60, display: "CA$250.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/333f9053-2cbb-4a58-bbf3-c8c0f3688871", duration: 60, display: "CA$300.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/779add4f-8b3f-4432-8447-ea2511ad9d8c", duration: 60, display: "CA$300.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/bb3a5c5f-d85a-428d-a72d-620fd16dac9d", duration: 60, display: "CA$200.00" },
  { eventTypeUri: "https://api.calendly.com/event_types/416eaca0-d7a7-46d6-bc30-85e77f2a9307", duration: 30, display: "CA$150.00" },
];

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
  return elapsedMinutes === 15 || elapsedMinutes === 30 || elapsedMinutes === 60 || elapsedMinutes === 75 ? elapsedMinutes : null;
}

/**
 * Returns contractual terms only for production event types explicitly exposed
 * by the site or specifically approved for a direct consultant Calendly profile.
 * Test, legacy and unknown Calendly events fail closed and must never trigger
 * a client contract.
 */
export function getContractFee(
  eventTypeUri: string | null,
  startTime: string | undefined,
  endTime: string | undefined,
): ContractFee | null {
  if (!eventTypeUri) return null;
  const directRule = directCalendlyFeeRules.find((rule) => rule.eventTypeUri === eventTypeUri);
  const configuredDuration = directRule?.duration ?? approvedEventDurations.get(eventTypeUri);
  const bookingDuration = scheduledDuration(startTime, endTime);
  if (!configuredDuration || configuredDuration !== bookingDuration) return null;

  if (directRule) {
    return { duration: directRule.duration, display: directRule.display };
  }

  return { duration: configuredDuration, display: FEES[configuredDuration] };
}
