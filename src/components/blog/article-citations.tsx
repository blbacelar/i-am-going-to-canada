import type { Article } from "@/lib/schemas/content";
import { localized, type Locale } from "@/lib/i18n/config";

export function ArticleCitations({
  article,
  sourceIds,
  locale,
  label,
}: {
  article: Article;
  sourceIds: string[];
  locale: Locale;
  label: string;
}) {
  if (!sourceIds.length) return null;

  return (
    <span className="article-citations" aria-label={label}>
      {sourceIds.map((sourceId) => {
        const source = article.sources.find((item) => item.id === sourceId);
        if (!source) return null;
        return (
          <a href={localized(source.url, locale)} key={source.id} rel="noreferrer" target="_blank">
            {localized(source.label, locale)} ↗
          </a>
        );
      })}
    </span>
  );
}
