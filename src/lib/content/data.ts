import consultantData from "../../../data/consultants.json";
import blogContentData from "../../../data/articles.json";
import siteContentData from "../../../data/site-content.json";
import {
  blogContentSchema,
  consultantsSchema,
  siteContentSchema,
  type Article,
  type Consultant,
  type Service,
} from "@/lib/schemas/content";

export const consultants = consultantsSchema.parse(consultantData);
export const blogContent = blogContentSchema.parse(blogContentData);
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

export function getArticles(): Article[] {
  return blogContent.articles.toSorted((a, b) => a.order - b.order);
}

export function getArticleBySlug(slug: string, locale: "en" | "fr" | "pt"): Article | undefined {
  return getArticles().find((article) => article.slugs[locale] === slug);
}

export function getArticlePath(article: Article, locale: "en" | "fr" | "pt"): string {
  return `/${locale}/blog/${article.slugs[locale]}`;
}

export function getArticleRouteMap() {
  return getArticles().map((article) => ({ id: article.id, slugs: article.slugs }));
}
