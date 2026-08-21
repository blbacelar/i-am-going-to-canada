import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, LocalizedDate } from "@/components/blog/article-body";
import { blogContent, getArticleBySlug, getArticlePath, getArticles, siteContent } from "@/lib/content/data";
import { isLocale, localized, locales, localePath, localeTags, type Locale } from "@/lib/i18n/config";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getArticles().flatMap((article) => locales.map((locale) => ({ locale, slug: localized(article.slugs, locale) })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = getArticleBySlug(slug, locale);
  if (!article) return {};
  const canonical = getArticlePath(article, locale);
  return {
    title: { absolute: localized(article.metaTitle, locale) },
    description: localized(article.metaDescription, locale),
    alternates: {
      canonical,
      languages: Object.fromEntries(locales.map((item) => [localeTags[item], getArticlePath(article, item)])),
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: localized(article.metaTitle, locale),
      description: localized(article.metaDescription, locale),
      url: canonical,
      siteName: siteContent.brand.name,
      locale: locale === "en" ? "en_CA" : locale === "fr" ? "fr_CA" : "pt_BR",
      type: "article",
    },
  };
}

function articleJsonLd(article: ReturnType<typeof getArticles>[number], locale: Locale) {
  const pageUrl = `${siteContent.brand.url}${getArticlePath(article, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": article.articleType,
    headline: localized(article.title, locale),
    description: localized(article.metaDescription, locale),
    dateCreated: article.draftedAt,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.modifiedAt ?? undefined,
    inLanguage: locale === "en" ? "en-CA" : locale === "fr" ? "fr-CA" : "pt-BR",
    author: { "@type": "Organization", name: article.author },
    reviewedBy: {
      "@type": "Person",
      name: article.reviewer,
      jobTitle: "Regulated Canadian Immigration Consultant (RCIC-IRB)",
      identifier: article.reviewerCredential,
    },
    publisher: { "@type": "Organization", name: siteContent.brand.name, url: siteContent.brand.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = getArticleBySlug(slug, locale);
  if (!article) notFound();
  const jsonLd = articleJsonLd(article, locale);

  return (
    <main id="main-content" className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="article-masthead">
        <div className="shell">
          <Link className="back-link" href={localePath(locale, "/blog")}>← {localized(blogContent.ui.backToBlog, locale)}</Link>
          <div className="article-masthead-meta">
            <span>{localized(article.category, locale)}</span>
          </div>
          <h1>{localized(article.title, locale)}</h1>
          <p className="article-dek">{localized(article.dek, locale)}</p>
          <div className="article-byline">
            <p><span>{localized(blogContent.ui.author, locale)}</span>{article.author}</p>
            <p><span>{localized(blogContent.ui.lastVerified, locale)}</span><LocalizedDate value={article.lastVerifiedAt} locale={locale} /></p>
          </div>
        </div>
      </header>
      <div className="shell article-shell">
        <ArticleBody article={article} locale={locale} />
      </div>
    </main>
  );
}
