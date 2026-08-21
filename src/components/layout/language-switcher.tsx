"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { trackJourneyEvent } from "@/lib/analytics/track";

const shortLabels: Record<Locale, string> = { en: "EN", fr: "FR", pt: "PT" };

type ArticleRoute = { id: string; slugs: Record<Locale, string> };

export function LanguageSwitcher({
  locale,
  label,
  articleRoutes,
}: {
  locale: Locale;
  label: string;
  articleRoutes: ArticleRoute[];
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="language-switcher" aria-label={label}>
      {locales.map((targetLocale) => {
        const nextSegments = [...segments];
        if (nextSegments.length && locales.includes(nextSegments[0] as Locale)) {
          nextSegments[0] = targetLocale;
        } else {
          nextSegments.unshift(targetLocale);
        }
        if (nextSegments[1] === "blog" && nextSegments[2]) {
          const article = articleRoutes.find((route) => Object.values(route.slugs).includes(nextSegments[2]));
          if (article) nextSegments[2] = article.slugs[targetLocale];
        }
        const href = `/${nextSegments.join("/")}`;
        return (
          <Link
            href={href}
            key={targetLocale}
            hrefLang={targetLocale}
            lang={targetLocale}
            aria-current={targetLocale === locale ? "page" : undefined}
            onClick={() => trackJourneyEvent({ event: "language_selected", locale: targetLocale })}
          >
            {shortLabels[targetLocale]}
          </Link>
        );
      })}
    </nav>
  );
}
