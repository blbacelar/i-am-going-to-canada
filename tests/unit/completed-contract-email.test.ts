import { describe, expect, it } from "vitest";
import { COMPLETED_CONTRACT_RECIPIENT, formatScheduledAppointment, renderCompletedContractEmail } from "@/lib/email/completed-contract-email";

describe("completed contract notification", () => {
  it("addresses the internal inbox and includes client and appointment details", () => {
    const email = renderCompletedContractEmail({
      clientName: "Client <Name>",
      clientEmail: "client@example.com",
      clientContact: "555-0100",
      scheduledAt: "2026-10-10T17:30:00.000Z",
    });

    expect(COMPLETED_CONTRACT_RECIPIENT).toBe("info@iamgoingtocanada.ca");
    expect(email.subject).toContain("Client <Name>");
    expect(email.html).toContain("Client &lt;Name&gt;");
    expect(email.html).toContain("client@example.com");
    expect(email.html).toContain("555-0100");
    expect(email.html).toContain(formatScheduledAppointment("2026-10-10T17:30:00.000Z"));
  });
});
