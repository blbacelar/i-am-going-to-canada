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
