import type { Consultant } from "@/lib/schemas/content";
import type { Locale } from "@/lib/i18n/config";

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
