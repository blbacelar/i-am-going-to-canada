import { describe, expect, it } from "vitest";
import rawConsultants from "../../data/consultants.json";
import rawContent from "../../data/site-content.json";
import { consultantsSchema, siteContentSchema } from "../../src/lib/schemas/content";

describe("content schemas", () => {
  it("accepts the project consultant and site content", () => {
    const consultants = consultantsSchema.parse(rawConsultants);
    expect(consultants).toHaveLength(4);
    expect(consultants.find((consultant) => consultant.id === "aline")).toMatchObject({
      name: "Aline Costa",
      languages: ["en", "fr", "es", "pt"],
      credentials: [{ label: "RCIC", value: "R710053" }],
    });
    expect(siteContentSchema.parse(rawContent).services).toHaveLength(6);
  });

  it("rejects duplicate consultant ids", () => {
    const duplicated = structuredClone(rawConsultants);
    duplicated[1].id = duplicated[0].id;
    expect(() => consultantsSchema.parse(duplicated)).toThrow(/Duplicate consultant id/);
  });
});
