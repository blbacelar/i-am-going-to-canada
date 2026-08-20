import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultantCard } from "@/components/consultants/consultant-card";
import { FinalCta } from "@/components/marketing/final-cta";
import { getActiveConsultants, getActiveServices, getServiceBySlug, siteContent } from "@/lib/content/data";
import { isLocale, localized, localePath } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getActiveServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return localizedMetadata({
    locale,
    title: localized(service.label, locale),
    description: localized(service.shortDescription, locale),
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const matchingConsultants = getActiveConsultants().filter((consultant) => consultant.serviceIds.includes(service.id));

  return (
    <main id="main-content">
      <section className="service-hero">
        <div className="shell service-hero-grid">
          <div>
            <Link className="back-link" href={localePath(locale, "/services")}>← {localized(siteContent.navigation.services, locale)}</Link>
            <h1>{localized(service.label, locale)}</h1>
          </div>
          <div>
            <p>{localized(service.detail, locale)}</p>
          </div>
        </div>
      </section>
      <section className="related-team">
        <div className="shell">
          <h2>{localized(siteContent.common.consultantsForService, locale)}</h2>
          <div className="consultant-grid">
            {matchingConsultants.map((consultant) => <ConsultantCard key={consultant.id} consultant={consultant} locale={locale} />)}
          </div>
        </div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
