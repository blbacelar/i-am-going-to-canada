export const locales = ["en", "fr", "pt"] as const;

export type Locale = (typeof locales)[number];
export type ConsultantLanguage = Locale | "es";

export type LocalizedString = Record<Locale, string>;

export const localeTags: Record<Locale, "en-CA" | "fr-CA" | "pt-BR"> = {
  en: "en-CA",
  fr: "fr-CA",
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
  pt: { en: "Inglês", fr: "Francês", es: "Espanhol", pt: "Português" },
};
