import type { Metadata } from "next";
import { siteContent } from "@/lib/content/data";
import { locales, localePath, type Locale } from "@/lib/i18n/config";

export function localizedMetadata({
  locale,
  title,
  description,
  path = "",
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const canonical = localePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((item) => [item, localePath(item, path)])),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteContent.brand.name,
      locale: locale === "en" ? "en_CA" : locale === "fr" ? "fr_CA" : "pt_BR",
      type: "website",
    },
  };
}
