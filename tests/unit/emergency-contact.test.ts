import { describe, expect, it } from "vitest";
import { emergencyContactSchema, renderEmergencyContactEmail } from "../../src/lib/contact/emergency";

describe("emergency contact email", () => {
  const validRequest = {
    name: "Ana Example",
    email: "ana@example.com",
    message: "I would like to discuss an urgent consultation.",
  };

  it("accepts concise contact information and rejects the honeypot", () => {
    expect(emergencyContactSchema.parse(validRequest)).toMatchObject(validRequest);
    expect(emergencyContactSchema.safeParse({ ...validRequest, website: "spam" }).success).toBe(false);
  });

  it("escapes visitor-provided content in the email HTML", () => {
    const html = renderEmergencyContactEmail({ ...validRequest, message: "<script>alert('x')</script>" });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert");
  });
});
