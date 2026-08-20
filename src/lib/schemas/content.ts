import { z } from "zod";

export const localizedStringSchema = z.object({
  en: z.string().min(1),
  fr: z.string().min(1),
  pt: z.string().min(1),
});

const credentialSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  verificationUrl: z.url().nullable(),
});

export const consultantSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  active: z.boolean(),
  order: z.number().int().nonnegative(),
  name: z.string().min(1),
  verificationStatus: z.enum([
    "verified-current",
    "needs-owner-confirmation",
    "todo-content",
  ]),
  role: localizedStringSchema,
  shortBio: localizedStringSchema,
  fullBio: localizedStringSchema,
  languages: z.array(z.enum(["en", "fr", "es", "pt"])),
  serviceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)),
  credentials: z.array(credentialSchema),
  portrait: z.object({
    src: z.string().startsWith("/consultants/"),
    alt: localizedStringSchema,
  }),
  calendlyUrl: z.union([z.literal("TODO_CONTENT"), z.url()]),
  seo: z.object({
    title: localizedStringSchema,
    description: localizedStringSchema,
  }),
});

export const consultantsSchema = z.array(consultantSchema).superRefine((items, ctx) => {
  const idSet = new Set<string>();
  const slugSet = new Set<string>();

  items.forEach((item, index) => {
    if (idSet.has(item.id)) {
      ctx.addIssue({ code: "custom", message: `Duplicate consultant id: ${item.id}`, path: [index, "id"] });
    }
    if (slugSet.has(item.slug)) {
      ctx.addIssue({ code: "custom", message: `Duplicate consultant slug: ${item.slug}`, path: [index, "slug"] });
    }
    idSet.add(item.id);
    slugSet.add(item.slug);
  });
});

const trustItemSchema = z.object({ title: localizedStringSchema, body: localizedStringSchema });
const processStepSchema = z.object({ title: localizedStringSchema, body: localizedStringSchema });

export const serviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  active: z.boolean(),
  order: z.number().int().nonnegative(),
  label: localizedStringSchema,
  shortDescription: localizedStringSchema,
  detail: localizedStringSchema,
});

const faqItemSchema = z.object({ question: localizedStringSchema, answer: localizedStringSchema });

export const siteContentSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    legalName: z.string().min(1),
    url: z.url(),
  }),
  navigation: z.object({
    home: localizedStringSchema,
    consultants: localizedStringSchema,
    services: localizedStringSchema,
    about: localizedStringSchema,
    faq: localizedStringSchema,
    find: localizedStringSchema,
    menu: localizedStringSchema,
    language: localizedStringSchema,
  }),
  home: z.object({
    hero: z.object({
      title: localizedStringSchema,
      body: localizedStringSchema,
      primaryCta: localizedStringSchema,
      secondaryCta: localizedStringSchema,
      teamLabel: localizedStringSchema,
    }),
    trust: z.array(trustItemSchema).min(3),
    concierge: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    team: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    services: z.object({
      title: localizedStringSchema,
      body: localizedStringSchema,
      viewAll: localizedStringSchema,
    }),
    process: z.object({ title: localizedStringSchema, steps: z.array(processStepSchema).min(3) }),
    stories: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    faqTitle: localizedStringSchema,
    final: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
  }),
  concierge: z.object({
    title: localizedStringSchema,
    intro: localizedStringSchema,
    languageQuestion: localizedStringSchema,
    serviceQuestion: localizedStringSchema,
    resultsTitle: localizedStringSchema,
    matchReason: localizedStringSchema,
    viewProfile: localizedStringSchema,
    viewAll: localizedStringSchema,
    restart: localizedStringSchema,
    back: localizedStringSchema,
    continue: localizedStringSchema,
    step: localizedStringSchema,
    noExactMatch: localizedStringSchema,
  }),
  services: z.array(serviceSchema),
  faq: z.array(faqItemSchema).min(5),
  pages: z.object({
    consultants: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    services: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    about: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    privacy: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
    disclaimer: z.object({ title: localizedStringSchema, body: localizedStringSchema }),
  }),
  common: z.object({
    viewProfile: localizedStringSchema,
    book: localizedStringSchema,
    bookingUnavailable: localizedStringSchema,
    publishedLanguages: localizedStringSchema,
    publishedServices: localizedStringSchema,
    contentReview: localizedStringSchema,
    informationComingSoon: localizedStringSchema,
    backToTeam: localizedStringSchema,
    consultantsForService: localizedStringSchema,
  }),
  footer: z.object({
    statement: localizedStringSchema,
    privacy: localizedStringSchema,
    disclaimer: localizedStringSchema,
    reviewNotice: localizedStringSchema,
  }),
}).superRefine((content, ctx) => {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  content.services.forEach((service, index) => {
    if (ids.has(service.id)) {
      ctx.addIssue({ code: "custom", message: `Duplicate service id: ${service.id}`, path: ["services", index, "id"] });
    }
    if (slugs.has(service.slug)) {
      ctx.addIssue({ code: "custom", message: `Duplicate service slug: ${service.slug}`, path: ["services", index, "slug"] });
    }
    ids.add(service.id);
    slugs.add(service.slug);
  });
});

export type Consultant = z.infer<typeof consultantSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
