import { describe, expect, it } from "vitest";
import { getContractConsultant } from "@/lib/contracts/consultant-assignment";

describe("contract consultant assignment", () => {
  it.each([
    ["https://api.calendly.com/event_types/b5ed003b-4a7d-48cb-9d64-4daea5921ed7", "marina-snyder", "/brand/marina-signature-transparent.png"],
    ["https://api.calendly.com/event_types/481e6e86-5478-45ae-a504-f92199a8ada5", "aline", "/brand/aline-signature-transparent.png"],
    ["https://api.calendly.com/event_types/eb4bc98a-ee31-42fd-86fc-f84b44e54e7c", "virginia-melo", "/brand/virginia-signature-transparent.png"],
    ["https://api.calendly.com/event_types/2f86c236-1e9e-4658-86fa-eee32048c6cb", "beatriz-dias", "/brand/beatriz-signature-transparent.png"],
  ])("assigns the correct consultant and signature for %s", (eventTypeUri, consultantId, signatureAssetPath) => {
    expect(getContractConsultant(eventTypeUri)).toMatchObject({ id: consultantId, signatureAssetPath });
  });

  it("fails closed for an unknown event", () => {
    expect(getContractConsultant("https://api.calendly.com/event_types/unknown")).toBeNull();
  });
});
