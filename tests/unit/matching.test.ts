import { describe, expect, it } from "vitest";
import { getActiveConsultants } from "../../src/lib/content/data";
import { matchConsultants, matchConsultantsByCriteria } from "../../src/lib/matching/match-consultants";

describe("consultant matching", () => {
  it("matches only public language and service metadata in configured order", () => {
    const matches = matchConsultants(getActiveConsultants(), "fr", "permanent-residence");
    expect(matches.map((match) => match.consultant.id)).toEqual(["marina-snyder", "virginia-melo"]);
  });

  it("returns no exact match when metadata does not intersect", () => {
    expect(matchConsultants(getActiveConsultants(), "fr", "complex-matters").map((match) => match.consultant.id)).toEqual(["marina-snyder"]);
    expect(matchConsultants(getActiveConsultants(), "pt", "unknown-service")).toEqual([]);
  });

  it("matches Portuguese with no regional or IRB filters to the full team", () => {
    expect(matchConsultantsByCriteria(getActiveConsultants(), "pt", []).map((consultant) => consultant.id)).toEqual([
      "marina-snyder",
      "virginia-melo",
      "beatriz-dias",
      "aline",
    ]);
  });

  it("applies the regional and IRB filters cumulatively", () => {
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", ["qc"]).map((consultant) => consultant.id)).toEqual([
      "marina-snyder",
      "virginia-melo",
    ]);
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", ["sk"]).map((consultant) => consultant.id)).toEqual(["marina-snyder"]);
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", ["irb"]).map((consultant) => consultant.id)).toEqual(["marina-snyder"]);
  });
});
