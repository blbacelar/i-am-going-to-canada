export const locales = ["en", "fr", "es", "pt"] as const;

export type Locale = (typeof locales)[number];
export type ConsultantLanguage = Locale;

export type LocalizedString = Record<Locale, string>;

export const localeTags: Record<Locale, "en-CA" | "fr-CA" | "es" | "pt-BR"> = {
  en: "en-CA",
  fr: "fr-CA",
  es: "es",
  pt: "pt-BR",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localized(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export function localePath(locale: Locale, path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export const languageNames: Record<Locale, Record<ConsultantLanguage, string>> = {
  en: { en: "English", fr: "French", es: "Spanish", pt: "Portuguese" },
  fr: { en: "Anglais", fr: "Français", es: "Espagnol", pt: "Portugais" },
  es: { en: "Inglés", fr: "Francés", es: "Español", pt: "Portugués" },
  pt: { en: "Inglês", fr: "Francês", es: "Espanhol", pt: "Português" },
};

export const practiceAreaNames: Record<Locale, Record<"qc" | "sk" | "irb" | "appeals", string>> = {
  en: {
    qc: "Québec (QC) processes",
    sk: "Saskatchewan (SK) processes",
    irb: "IRB matters",
    appeals: "Appeals and related matters",
  },
  fr: {
    qc: "Dossiers du Québec (QC)",
    sk: "Dossiers de la Saskatchewan (SK)",
    irb: "Dossiers devant la CISR",
    appeals: "Appels et dossiers connexes",
  },
  es: {
    qc: "Procesos de Quebec (QC)",
    sk: "Procesos de Saskatchewan (SK)",
    irb: "Asuntos ante el IRB",
    appeals: "Apelaciones y asuntos relacionados",
  },
  pt: {
    qc: "Processos do Québec (QC)",
    sk: "Processos de Saskatchewan (SK)",
    irb: "Processos perante o IRB",
    appeals: "Apelações e questões relacionadas",
  },
};
