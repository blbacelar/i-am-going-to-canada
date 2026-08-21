import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogContent, getArticles } from "@/lib/content/data";
import { isLocale, localized, localePath, locales, localeTags } from "@/lib/i18n/config";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: localized(blogContent.ui.title, locale),
    description: localized(blogContent.ui.intro, locale),
    alternates: {
      canonical: localePath(locale, "/blog"),
      languages: Object.fromEntries(locales.map((item) => [localeTags[item], localePath(item, "/blog")])),
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const articles = getArticles();

  return (
    <main id="main-content" className="blog-index">
      <section className="blog-index-hero">
        <div className="shell blog-index-heading">
          <div>
            <p className="eyebrow">{localized(blogContent.ui.eyebrow, locale)}</p>
            <h1>{localized(blogContent.ui.title, locale)}</h1>
          </div>
          <div>
            <p>{localized(blogContent.ui.intro, locale)}</p>
          </div>
        </div>
      </section>

      <section className="blog-feed shell" aria-label={localized(blogContent.ui.title, locale)}>
        {articles.map((article, index) => (
          <article className="blog-feed-item" key={article.id}>
            <p className="blog-feed-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
            <div className="blog-feed-copy">
              <div className="blog-feed-meta">
                <span>{localized(article.category, locale)}</span>
              </div>
              <h2>
                <Link href={localePath(locale, `/blog/${localized(article.slugs, locale)}`)}>
                  {localized(article.title, locale)}
                </Link>
              </h2>
              <p>{localized(article.dek, locale)}</p>
              <Link className="editorial-link" href={localePath(locale, `/blog/${localized(article.slugs, locale)}`)}>
                {localized(blogContent.ui.readArticle, locale)} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
