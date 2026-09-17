export const defaultIrbCalendlyUrl = "https://calendly.com/marinasnyderrcic/irb-consultation-consultation-cisr";

export function resolveBookingBaseUrl(input: {
  hasIrbMatter: boolean;
  testCalendlyUrl?: string;
  assignedConsultantUrl?: string;
  irbCalendlyUrl?: string;
}): string | undefined {
  if (input.hasIrbMatter) return input.irbCalendlyUrl || defaultIrbCalendlyUrl;
  return input.testCalendlyUrl || input.assignedConsultantUrl;
}
