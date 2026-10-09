import { describe, expect, it } from "vitest";
import { INITIAL_QUESTIONNAIRE_URL, renderContractEmail } from "@/lib/email/contract-email";

describe("contract email", () => {
  it("always includes the required initial questionnaire link", async () => {
    const email = await renderContractEmail({
      name: "Test Client",
      signingUrl: "https://sign.example/document/123",
      language: "en",
    });

    expect(email.html).toContain(INITIAL_QUESTIONNAIRE_URL);
    expect(email.html).toContain("required questionnaire");
  });
});
