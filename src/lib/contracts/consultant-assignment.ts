import { consultants } from "@/lib/content/data";

export type ContractConsultant = {
  id: string;
  name: string;
  credentialLabel: string;
  credentialValue: string;
  contact: string;
  signatureAssetPath: string;
};

const FIRM_CONTACT = "533 St-Pierre, Drummondville, QC J2C 6M1, Bureau 205 | (819) 817-5048";

const signatureAssets: Record<string, { path: string }> = {
  "marina-snyder": { path: "/brand/marina-signature-transparent.png" },
  aline: { path: "/brand/aline-signature-transparent.png" },
  "virginia-melo": { path: "/brand/virginia-signature-transparent.png" },
  "beatriz-dias": { path: "/brand/beatriz-signature-transparent.png" },
};

/** Direct Calendly event types not represented in the public finder data. */
const directEventConsultantIds = new Map<string, string>([
  ["https://api.calendly.com/event_types/b1e06f07-48cf-4f61-b110-e2fefecb1e6a", "marina-snyder"],
  ["https://api.calendly.com/event_types/39fa4ed6-5d5e-4688-b41a-490933de1d81", "marina-snyder"],
  ["https://api.calendly.com/event_types/3e1b94a3-d35f-4f3e-ae18-50b0aaaba554", "marina-snyder"],
  ["https://api.calendly.com/event_types/ddc7943c-2092-44bf-85a6-80329c5805a7", "marina-snyder"],
  ["https://api.calendly.com/event_types/eb4bc98a-ee31-42fd-86fc-f84b44e54e7c", "virginia-melo"],
  ["https://api.calendly.com/event_types/333f9053-2cbb-4a58-bbf3-c8c0f3688871", "virginia-melo"],
  ["https://api.calendly.com/event_types/779add4f-8b3f-4432-8447-ea2511ad9d8c", "virginia-melo"],
  ["https://api.calendly.com/event_types/bb3a5c5f-d85a-428d-a72d-620fd16dac9d", "virginia-melo"],
  ["https://api.calendly.com/event_types/416eaca0-d7a7-46d6-bc30-85e77f2a9307", "virginia-melo"],
]);

const configuredEventConsultantIds = new Map<string, string>();
for (const consultant of consultants) {
  for (const appointment of Object.values(consultant.calendlyAppointments)) {
    if (appointment?.eventTypeUri !== "TODO_CONTENT") {
      configuredEventConsultantIds.set(appointment.eventTypeUri, consultant.id);
    }
  }
}

/**
 * Resolves a booking to a consultant and a verified signature asset. Contracts
 * fail closed when a consultant's signature is not yet approved for use.
 */
export function getContractConsultant(eventTypeUri: string | null): ContractConsultant | null {
  if (!eventTypeUri) return null;
  const consultantId = directEventConsultantIds.get(eventTypeUri) ?? configuredEventConsultantIds.get(eventTypeUri);
  const signatureAsset = consultantId ? signatureAssets[consultantId] : undefined;
  if (!consultantId || !signatureAsset) return null;

  const consultant = consultants.find((item) => item.id === consultantId);
  const credential = consultant?.credentials.find((item) => item.label.includes("RCIC"));
  if (!consultant || !credential) return null;

  return {
    id: consultant.id,
    name: consultant.name,
    credentialLabel: credential.label,
    credentialValue: credential.value,
    contact: FIRM_CONTACT,
    signatureAssetPath: signatureAsset.path,
  };
}
