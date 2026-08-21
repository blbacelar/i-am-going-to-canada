import type { MetadataRoute } from "next";
import { getActiveConsultants, getActiveServices, getArticles, siteContent } from "@/lib/content/data";
import { locales, localePath, localized } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/find-a-consultant", "/consultants", "/services", "/about", "/faq", "/privacy", "/disclaimer", "/blog"];
  const urls = locales.flatMap((locale) => [
    ...staticPaths.map((path) => ({ url: `${siteContent.brand.url}${localePath(locale, path)}` })),
    ...getActiveConsultants().map((consultant) => ({ url: `${siteContent.brand.url}${localePath(locale, `/consultants/${consultant.slug}`)}` })),
    ...getActiveServices().map((service) => ({ url: `${siteContent.brand.url}${localePath(locale, `/services/${service.slug}`)}` })),
    ...getArticles().filter((article) => article.status === "approved_for_publish").map((article) => ({ url: `${siteContent.brand.url}${localePath(locale, `/blog/${localized(article.slugs, locale)}`)}`, lastModified: article.modifiedAt ?? article.publishedAt ?? undefined })),
  ]);

  return urls.map((item) => ({
    url: item.url,
    changeFrequency: "monthly",
    priority: item.url.endsWith("/en") || item.url.endsWith("/fr") || item.url.endsWith("/pt") ? 1 : 0.7,
  }));
}
