import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageIntro } from "@/components/marketing/page-intro";
import { RouteArrow } from "@/components/ui/route-arrow";
import { getActiveServices, siteContent } from "@/lib/content/data";
import { isLocale, localized, localePath } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteContent.pages.services;
  return localizedMetadata({ locale, title: copy.title[locale], description: copy.body[locale], path: "/services" });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteContent.pages.services;
  return (
    <main id="main-content">
      <PageIntro title={localized(copy.title, locale)} body={localized(copy.body, locale)} />
      <section className="directory-section">
        <div className="shell service-directory">
          {getActiveServices().map((service) => (
            <Link key={service.id} href={localePath(locale, `/services/${service.slug}`)}>
              <h2>{localized(service.label, locale)}</h2>
              <p>{localized(service.shortDescription, locale)}</p>
              <RouteArrow />
            </Link>
          ))}
        </div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
