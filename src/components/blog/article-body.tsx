import Link from "next/link";
import { ArticleCitations } from "@/components/blog/article-citations";
import { blogContent } from "@/lib/content/data";
import { localized, localePath, type Locale } from "@/lib/i18n/config";
import type { Article } from "@/lib/schemas/content";

export function LocalizedDate({ value, locale }: { value: string; locale: Locale }) {
  const localeCode = locale === "en" ? "en-CA" : locale === "fr" ? "fr-CA" : "pt-BR";
  return new Intl.DateTimeFormat(localeCode, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function ArticleBody({ article, locale }: { article: Article; locale: Locale }) {
  const ui = blogContent.ui;

  return (
    <>
      <section className="article-key-facts" aria-labelledby="key-facts-heading">
        <h2 className="eyebrow" id="key-facts-heading">{localized(ui.facts, locale)}</h2>
        <dl>
          {article.keyFacts.map((fact) => (
            <div key={localized(fact.label, locale)}>
              <dt>{localized(fact.label, locale)}</dt>
              <dd>
                {localized(fact.value, locale)}
                <ArticleCitations
                  article={article}
                  sourceIds={fact.sourceIds}
                  locale={locale}
                  label={localized(ui.officialSource, locale)}
                />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="article-reading-grid">
        <aside className="article-toc" aria-labelledby="article-toc-heading">
          <h2 className="eyebrow" id="article-toc-heading">{localized(ui.contents, locale)}</h2>
          <ol>
            {article.sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}>{localized(section.heading, locale)}</a></li>
            ))}
          </ol>
        </aside>

        <div className="article-prose">
          {article.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{localized(section.heading, locale)}</h2>
              {section.blocks.map((block, blockIndex) => {
                if (block.type === "heading3") {
                  return <h3 id={block.id} key={`${block.id}-${blockIndex}`}>{localized(block.text, locale)}</h3>;
                }

                if (block.type === "paragraph") {
                  return (
                    <p key={`${section.id}-paragraph-${blockIndex}`}>
                      {localized(block.text, locale)}
                      <ArticleCitations
                        article={article}
                        sourceIds={block.sourceIds}
                        locale={locale}
                        label={localized(ui.officialSource, locale)}
                      />
                    </p>
                  );
                }

                const List = block.type === "orderedList" ? "ol" : "ul";
                return (
                  <div className="article-list-block" key={`${section.id}-list-${blockIndex}`}>
                    <List>
                      {block.items.map((item, itemIndex) => <li key={`${section.id}-${blockIndex}-${itemIndex}`}>{localized(item, locale)}</li>)}
                    </List>
                    <ArticleCitations
                      article={article}
                      sourceIds={block.sourceIds}
                      locale={locale}
                      label={localized(ui.officialSource, locale)}
                    />
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>

      <section className="article-endmatter">
        <div className="article-source-list">
          <h2 className="eyebrow">{localized(ui.sources, locale)}</h2>
          <ul>
            {article.sources.map((source) => (
              <li key={source.id}>
                <a href={localized(source.url, locale)} rel="noreferrer" target="_blank">
                  <span>{localized(source.label, locale)}</span>
                  <small>{source.owner} ↗</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="article-internal-links">
          <h2 className="eyebrow">{localized(ui.internalLinks, locale)}</h2>
          <ul>
            {article.internalLinks.map((link) => (
              <li key={link.path}><Link href={localePath(locale, link.path)}>{localized(link.label, locale)} →</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="article-cta">
        <div>
          <p className="eyebrow">I Am Going To Canada</p>
          <h2>{localized(article.cta.title, locale)}</h2>
          <p>{localized(article.cta.body, locale)}</p>
        </div>
        <Link className="button" href={localePath(locale, "/find-a-consultant")}>
          {localized(ui.ctaButton, locale)}
        </Link>
      </section>

      <aside className="article-disclaimer">
        <p>{localized(article.disclaimer, locale)}</p>
      </aside>

      <footer className="article-review-footer">
        <p><strong>{localized(ui.lastVerified, locale)}:</strong> <LocalizedDate value={article.lastVerifiedAt} locale={locale} /></p>
        <p><strong>{localized(ui.nextReview, locale)}:</strong> <LocalizedDate value={article.freshnessReviewAt} locale={locale} /></p>
      </footer>
    </>
  );
}
