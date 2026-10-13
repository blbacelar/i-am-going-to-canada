import { describe, expect, it } from "vitest";
import { getContractFee } from "@/lib/contracts/consultation-fees";

describe("contract consultation fees", () => {
  it("assigns the fixed CA$150 price to an approved 30-minute booking", () => {
    expect(getContractFee(
      "https://api.calendly.com/event_types/b5ed003b-4a7d-48cb-9d64-4daea5921ed7",
      "2026-10-08T10:00:00.000Z",
      "2026-10-08T10:30:00.000Z",
    )).toEqual({ duration: 30, display: "CA$150.00" });
  });

  it("assigns the fixed CA$200 price to an approved 60-minute booking", () => {
    expect(getContractFee(
      "https://api.calendly.com/event_types/69664e4a-4edf-40b4-a349-b7495355c61f",
      "2026-10-08T10:00:00.000Z",
      "2026-10-08T11:00:00.000Z",
    )).toEqual({ duration: 60, display: "CA$200.00" });
  });

  it.each([
    ["Xpress Call", "https://api.calendly.com/event_types/b1e06f07-48cf-4f61-b110-e2fefecb1e6a", 15, "CA$85.00"],
    ["IRB Consultation", "https://api.calendly.com/event_types/39fa4ed6-5d5e-4688-b41a-490933de1d81", 75, "CA$300.00"],
    ["Temporary residence review", "https://api.calendly.com/event_types/3e1b94a3-d35f-4f3e-ae18-50b0aaaba554", 60, "CA$300.00"],
    ["Mentoring / consulting", "https://api.calendly.com/event_types/ddc7943c-2092-44bf-85a6-80329c5805a7", 60, "CA$150.00"],
    ["Virginia Emergency", "https://api.calendly.com/event_types/eb4bc98a-ee31-42fd-86fc-f84b44e54e7c", 60, "CA$250.00"],
    ["Virginia Arrima or Express Entry review", "https://api.calendly.com/event_types/333f9053-2cbb-4a58-bbf3-c8c0f3688871", 60, "CA$300.00"],
    ["Virginia Temporary residence review", "https://api.calendly.com/event_types/779add4f-8b3f-4432-8447-ea2511ad9d8c", 60, "CA$300.00"],
    ["Virginia 60-minute consultation", "https://api.calendly.com/event_types/bb3a5c5f-d85a-428d-a72d-620fd16dac9d", 60, "CA$200.00"],
    ["Virginia 30-minute consultation", "https://api.calendly.com/event_types/416eaca0-d7a7-46d6-bc30-85e77f2a9307", 30, "CA$150.00"],
  ] as const)("assigns the approved fee for direct %s event", (_name, eventTypeUri, duration, display) => {
    const start = "2026-10-08T10:00:00.000Z";
    const end = new Date(Date.parse(start) + duration * 60_000).toISOString();

    expect(getContractFee(eventTypeUri, start, end)).toEqual({ duration, display });
  });

  it("rejects test, unknown, and duration-mismatched event types", () => {
    expect(getContractFee(
      "https://api.calendly.com/event_types/test-event",
      "2026-10-08T10:00:00.000Z",
      "2026-10-08T10:30:00.000Z",
    )).toBeNull();
    expect(getContractFee(
      "https://api.calendly.com/event_types/b5ed003b-4a7d-48cb-9d64-4daea5921ed7",
      "2026-10-08T10:00:00.000Z",
      "2026-10-08T11:00:00.000Z",
    )).toBeNull();
  });
});
