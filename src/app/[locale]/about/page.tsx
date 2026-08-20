import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageIntro } from "@/components/marketing/page-intro";
import { RouteArrow } from "@/components/ui/route-arrow";
import { siteContent } from "@/lib/content/data";
import { isLocale, localized, localePath } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteContent.pages.about;
  return localizedMetadata({ locale, title: copy.title[locale], description: copy.body[locale], path: "/about" });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteContent.pages.about;
  return (
    <main id="main-content">
      <PageIntro title={localized(copy.title, locale)} body={localized(copy.body, locale)} />
      <section className="about-principles">
        <div className="shell about-grid">
          {siteContent.home.trust.map((item) => (
            <article key={item.title.en}>
              <h2>{localized(item.title, locale)}</h2>
              <p>{localized(item.body, locale)}</p>
            </article>
          ))}
        </div>
        <div className="shell about-team-link">
          <Link className="editorial-link" href={localePath(locale, "/consultants")}>
            {localized(siteContent.navigation.consultants, locale)} <RouteArrow />
          </Link>
        </div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
