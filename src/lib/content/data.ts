import consultantData from "../../../data/consultants.json";
import siteContentData from "../../../data/site-content.json";
import {
  consultantsSchema,
  siteContentSchema,
  type Consultant,
  type Service,
} from "@/lib/schemas/content";

export const consultants = consultantsSchema.parse(consultantData);
export const siteContent = siteContentSchema.parse(siteContentData);

const serviceIdSet = new Set(siteContent.services.map((service) => service.id));

for (const consultant of consultants) {
  for (const serviceId of consultant.serviceIds) {
    if (!serviceIdSet.has(serviceId)) {
      throw new Error(`Consultant ${consultant.id} references unknown service ${serviceId}`);
    }
  }
}

export function getActiveConsultants(): Consultant[] {
  return consultants
    .filter((consultant) => consultant.active)
    .toSorted((a, b) => a.order - b.order);
}

export function getConsultantBySlug(slug: string): Consultant | undefined {
  return getActiveConsultants().find((consultant) => consultant.slug === slug);
}

export function getActiveServices(): Service[] {
  return siteContent.services
    .filter((service) => service.active)
    .toSorted((a, b) => a.order - b.order);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getActiveServices().find((service) => service.slug === slug);
}

export function getServiceById(id: string): Service | undefined {
  return getActiveServices().find((service) => service.id === id);
}
