import { describe, expect, it } from "vitest";
import { getActiveConsultants } from "../../src/lib/content/data";
import { matchConsultants } from "../../src/lib/matching/match-consultants";

describe("consultant matching", () => {
  it("matches only public language and service metadata in configured order", () => {
    const matches = matchConsultants(getActiveConsultants(), "fr", "permanent-residence");
    expect(matches.map((match) => match.consultant.id)).toEqual(["marina-snyder", "virginia-melo"]);
  });

  it("returns no exact match when metadata does not intersect", () => {
    expect(matchConsultants(getActiveConsultants(), "fr", "complex-matters").map((match) => match.consultant.id)).toEqual(["marina-snyder"]);
    expect(matchConsultants(getActiveConsultants(), "pt", "unknown-service")).toEqual([]);
  });
});
