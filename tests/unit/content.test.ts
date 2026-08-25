import { describe, expect, it } from "vitest";
import rawConsultants from "../../data/consultants.json";
import rawArticles from "../../data/articles.json";
import rawContent from "../../data/site-content.json";
import { blogContentSchema, consultantsSchema, siteContentSchema } from "../../src/lib/schemas/content";

describe("content schemas", () => {
  it("accepts the project consultant and site content", () => {
    const consultants = consultantsSchema.parse(rawConsultants);
    expect(consultants).toHaveLength(4);
    expect(consultants.find((consultant) => consultant.id === "aline")).toMatchObject({
      name: "Aline Costa",
      languages: ["en", "es", "pt"],
      practiceAreas: [],
      credentials: [{ label: "RCIC", value: "R710053" }],
      calendlyUrl: "https://calendly.com/costalineimmigration",
    });
    expect(siteContentSchema.parse(rawContent).services).toHaveLength(6);
    const blog = blogContentSchema.parse(rawArticles);
    expect(blog.articles).toHaveLength(3);
    expect(blog.articles.every((article) => ["ready_for_human_review", "approved_for_publish"].includes(article.status))).toBe(true);
  });

  it("rejects duplicate consultant ids", () => {
    const duplicated = structuredClone(rawConsultants);
    duplicated[1].id = duplicated[0].id;
    expect(() => consultantsSchema.parse(duplicated)).toThrow(/Duplicate consultant id/);
  });

  it("keeps article slugs unique in every locale", () => {
    const blog = blogContentSchema.parse(rawArticles);
    for (const locale of ["en", "fr", "pt"] as const) {
      const slugs = blog.articles.map((article) => article.slugs[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("rejects article references to unknown sources", () => {
    const invalid = structuredClone(rawArticles);
    invalid.articles[0].keyFacts[0].sourceIds = ["missing-source"];
    expect(() => blogContentSchema.parse(invalid)).toThrow(/unknown source/);
  });
});
