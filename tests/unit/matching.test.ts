import { describe, expect, it } from "vitest";
import { getActiveConsultants } from "../../src/lib/content/data";
import { defaultIrbCalendlyUrl, resolveBookingBaseUrl } from "../../src/lib/booking/routing";
import { matchConsultants, matchConsultantsByCriteria } from "../../src/lib/matching/match-consultants";

describe("consultant matching", () => {
  it("matches only public language and service metadata in configured order", () => {
    const matches = matchConsultants(getActiveConsultants(), "fr", "permanent-residence");
    expect(matches.map((match) => match.consultant.id)).toEqual(["marina-snyder", "virginia-melo"]);
  });

  it("returns no exact match when metadata does not intersect", () => {
    expect(matchConsultants(getActiveConsultants(), "fr", "complex-matters").map((match) => match.consultant.id)).toEqual(["marina-snyder"]);
    expect(matchConsultants(getActiveConsultants(), "es", "unknown-service")).toEqual([]);
  });

  it("matches Spanish with no regional or IRB filters to the published Spanish-speaking consultant", () => {
    expect(matchConsultantsByCriteria(getActiveConsultants(), "es", []).map((consultant) => consultant.id)).toEqual([
      "aline",
    ]);
  });

  it("keeps Portuguese available across the full published team", () => {
    expect(matchConsultantsByCriteria(getActiveConsultants(), "pt", []).map((consultant) => consultant.id)).toEqual([
      "marina-snyder",
      "virginia-melo",
      "beatriz-dias",
      "aline",
    ]);
  });

  it("enforces the stated language and regional restrictions", () => {
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", []).map((consultant) => consultant.id)).toEqual([
      "marina-snyder",
      "virginia-melo",
      "beatriz-dias",
      "aline",
    ]);
    expect(matchConsultantsByCriteria(getActiveConsultants(), "fr", []).map((consultant) => consultant.id)).toEqual([
      "marina-snyder",
      "virginia-melo",
    ]);
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", ["qc"]).map((consultant) => consultant.id)).toEqual([
      "marina-snyder",
      "virginia-melo",
    ]);
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", ["sk"]).map((consultant) => consultant.id)).toEqual(["marina-snyder"]);
    expect(matchConsultantsByCriteria(getActiveConsultants(), "en", ["irb"]).map((consultant) => consultant.id)).toEqual(["marina-snyder"]);
  });

  it.each([
    ["English, general", "en", [], ["marina-snyder", "virginia-melo", "beatriz-dias", "aline"]],
    ["French, general", "fr", [], ["marina-snyder", "virginia-melo"]],
    ["Spanish, general", "es", [], ["aline"]],
    ["Portuguese, general", "pt", [], ["marina-snyder", "virginia-melo", "beatriz-dias", "aline"]],
    ["English, Québec", "en", ["qc"], ["marina-snyder", "virginia-melo"]],
    ["French, Québec", "fr", ["qc"], ["marina-snyder", "virginia-melo"]],
    ["Portuguese, Québec", "pt", ["qc"], ["marina-snyder", "virginia-melo"]],
    ["English, Saskatchewan", "en", ["sk"], ["marina-snyder"]],
    ["French, Saskatchewan", "fr", ["sk"], ["marina-snyder"]],
    ["Portuguese, Saskatchewan", "pt", ["sk"], ["marina-snyder"]],
    ["English, IRB", "en", ["irb"], ["marina-snyder"]],
    ["French, IRB", "fr", ["irb"], ["marina-snyder"]],
    ["Portuguese, IRB", "pt", ["irb"], ["marina-snyder"]],
    ["Spanish + Québec conflict", "es", ["qc"], []],
    ["Spanish + Saskatchewan conflict", "es", ["sk"], []],
    ["Spanish + IRB conflict", "es", ["irb"], []],
  ] as const)("routes %s only to the allowed consultants", (_scenario, language, areas, expectedIds) => {
    expect(matchConsultantsByCriteria(getActiveConsultants(), language, areas).map((consultant) => consultant.id)).toEqual(expectedIds);
  });

  it("offers only Calendly durations actually configured for the eligible consultant", () => {
    const spanishMatches = matchConsultantsByCriteria(getActiveConsultants(), "es", []);
    expect(spanishMatches).toHaveLength(1);
    expect(Object.keys(spanishMatches[0].calendlyAppointments)).toEqual(["30", "60"]);

    const saskatchewanMatches = matchConsultantsByCriteria(getActiveConsultants(), "en", ["sk"]);
    expect(saskatchewanMatches).toHaveLength(1);
    expect(Object.keys(saskatchewanMatches[0].calendlyAppointments)).toEqual(["30", "60"]);
  });

  it("uses the dedicated IRB event instead of the shared test or regular event", () => {
    expect(resolveBookingBaseUrl({
      hasIrbMatter: true,
      testCalendlyUrl: "https://calendly.com/test-event",
      assignedConsultantUrl: "https://calendly.com/regular-event",
    })).toBe(defaultIrbCalendlyUrl);
    expect(resolveBookingBaseUrl({
      hasIrbMatter: true,
      irbCalendlyUrl: "https://calendly.com/marina/irb-event",
    })).toBe("https://calendly.com/marina/irb-event");
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
