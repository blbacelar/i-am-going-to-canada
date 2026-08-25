import type { Consultant } from "@/lib/schemas/content";
import type { ConsultantLanguage, Locale } from "@/lib/i18n/config";

export type PracticeArea = "qc" | "sk" | "irb";

export interface ConsultantMatch {
  consultant: Consultant;
  matchedLanguage: Locale;
  matchedServiceId: string;
}

export function matchConsultants(
  consultants: Consultant[],
  language: Locale,
  serviceId: string,
): ConsultantMatch[] {
  return consultants
    .filter(
      (consultant) =>
        consultant.active &&
        consultant.languages.includes(language) &&
        consultant.serviceIds.includes(serviceId),
    )
    .toSorted((a, b) => a.order - b.order)
    .map((consultant) => ({ consultant, matchedLanguage: language, matchedServiceId: serviceId }));
}

export function matchConsultantsByCriteria(
  consultants: Consultant[],
  language: ConsultantLanguage,
  practiceAreas: PracticeArea[],
): Consultant[] {
  return consultants
    .filter(
      (consultant) =>
        consultant.active &&
        consultant.languages.includes(language) &&
        practiceAreas.every((area) => consultant.practiceAreas.includes(area)),
    )
    .toSorted((a, b) => a.order - b.order);
}
