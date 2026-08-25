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
  practiceAreas: z.array(z.enum(["qc", "sk", "irb", "appeals"])),
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
const legalSectionSchema = z.object({
  title: localizedStringSchema,
  paragraphs: z.array(localizedStringSchema).min(1),
});
const legalPageSchema = z.object({
  title: localizedStringSchema,
  intro: localizedStringSchema,
  updatedAt: localizedStringSchema,
  reviewNotice: localizedStringSchema,
  sections: z.array(legalSectionSchema).min(3),
  resourcesTitle: localizedStringSchema,
  resources: z.array(z.object({
    label: localizedStringSchema,
    url: z.union([z.url(), z.string().startsWith("mailto:")]),
  })).min(1),
});

export const siteContentSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    legalName: z.string().min(1),
    url: z.url(),
  }),
  navigation: z.object({
    home: localizedStringSchema,
    blog: localizedStringSchema,
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
    qcQuestion: localizedStringSchema,
    skQuestion: localizedStringSchema,
    irbQuestion: localizedStringSchema,
    yes: localizedStringSchema,
    no: localizedStringSchema,
    availabilityNote: localizedStringSchema,
    checkAvailability: localizedStringSchema,
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
    privacy: legalPageSchema,
    disclaimer: legalPageSchema,
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

const articleSourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  owner: z.string().min(1),
  label: localizedStringSchema,
  url: z.object({ en: z.url(), fr: z.url(), pt: z.url() }),
});

const articleParagraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  text: localizedStringSchema,
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
});

const articleHeadingBlockSchema = z.object({
  type: z.literal("heading3"),
  id: z.string().regex(/^[a-z0-9-]+$/),
  text: localizedStringSchema,
});

const articleListBlockSchema = z.object({
  type: z.enum(["unorderedList", "orderedList"]),
  items: z.array(localizedStringSchema).min(1),
  sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
});

const articleBlockSchema = z.discriminatedUnion("type", [
  articleParagraphBlockSchema,
  articleHeadingBlockSchema,
  articleListBlockSchema,
]);

const articleSectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  heading: localizedStringSchema,
  blocks: z.array(articleBlockSchema).min(1),
});

export const articleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().nonnegative(),
  status: z.enum(["ready_for_human_review", "approved_for_publish"]),
  articleType: z.enum(["Article", "NewsArticle"]),
  draftedAt: z.iso.date(),
  lastVerifiedAt: z.iso.date(),
  freshnessReviewAt: z.iso.date(),
  publishedAt: z.iso.date().nullable(),
  modifiedAt: z.iso.date().nullable(),
  author: z.literal("I Am Going To Canada Editorial Team"),
  reviewer: z.string().min(1),
  reviewerCredential: z.string().min(1),
  slugs: localizedStringSchema,
  category: localizedStringSchema,
  title: localizedStringSchema,
  dek: localizedStringSchema,
  metaTitle: localizedStringSchema,
  metaDescription: localizedStringSchema,
  keyFacts: z.array(z.object({
    label: localizedStringSchema,
    value: localizedStringSchema,
    sourceIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  })).min(3),
  sections: z.array(articleSectionSchema).min(3),
  sources: z.array(articleSourceSchema).min(1),
  internalLinks: z.array(z.object({
    path: z.string().startsWith("/"),
    label: localizedStringSchema,
  })).min(1),
  cta: z.object({
    title: localizedStringSchema,
    body: localizedStringSchema,
  }),
  disclaimer: localizedStringSchema,
});

export const blogContentSchema = z.object({
  ui: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    intro: localizedStringSchema,
    readArticle: localizedStringSchema,
    backToBlog: localizedStringSchema,
    facts: localizedStringSchema,
    contents: localizedStringSchema,
    sources: localizedStringSchema,
    internalLinks: localizedStringSchema,
    lastVerified: localizedStringSchema,
    nextReview: localizedStringSchema,
    author: localizedStringSchema,
    ctaButton: localizedStringSchema,
    officialSource: localizedStringSchema,
  }),
  articles: z.array(articleSchema).min(1),
}).superRefine((content, ctx) => {
  const ids = new Set<string>();
  const slugs = { en: new Set<string>(), fr: new Set<string>(), pt: new Set<string>() };

  content.articles.forEach((article, articleIndex) => {
    if (ids.has(article.id)) {
      ctx.addIssue({ code: "custom", message: `Duplicate article id: ${article.id}`, path: ["articles", articleIndex, "id"] });
    }
    ids.add(article.id);

    (Object.keys(slugs) as Array<keyof typeof slugs>).forEach((locale) => {
      const slug = article.slugs[locale];
      if (slugs[locale].has(slug)) {
        ctx.addIssue({ code: "custom", message: `Duplicate ${locale} article slug: ${slug}`, path: ["articles", articleIndex, "slugs", locale] });
      }
      slugs[locale].add(slug);
    });

    const sourceIds = new Set(article.sources.map((source) => source.id));
    const referencedSourceIds = [
      ...article.keyFacts.flatMap((fact) => fact.sourceIds),
      ...article.sections.flatMap((section) => section.blocks.flatMap((block) => "sourceIds" in block ? block.sourceIds : [])),
    ];
    referencedSourceIds.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) {
        ctx.addIssue({ code: "custom", message: `Article ${article.id} references unknown source ${sourceId}`, path: ["articles", articleIndex, "sources"] });
      }
    });
  });
});

export type Article = z.infer<typeof articleSchema>;
export type BlogContent = z.infer<typeof blogContentSchema>;
