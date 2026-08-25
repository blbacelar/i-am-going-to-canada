import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Concierge, type ConciergeCopy } from "@/components/concierge/concierge";
import { ConsultantCard } from "@/components/consultants/consultant-card";
import { TeamMosaic } from "@/components/consultants/team-mosaic";
import { FaqList } from "@/components/marketing/faq-list";
import { FinalCta } from "@/components/marketing/final-cta";
import { RouteArrow } from "@/components/ui/route-arrow";
import { getActiveConsultants, getActiveServices, siteContent } from "@/lib/content/data";
import { isLocale, localized, localePath } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({
    locale,
    title: siteContent.home.hero.title[locale],
    description: siteContent.home.hero.body[locale],
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const consultants = getActiveConsultants();
  const services = getActiveServices();
  const { home, concierge } = siteContent;
  const trustLabel = {
    en: "Why clients choose our team",
    fr: "Pourquoi choisir notre équipe",
    pt: "Por que escolher nossa equipe",
  }[locale];

  const conciergeCopy: ConciergeCopy = {
    intro: localized(concierge.intro, locale),
    languageQuestion: localized(concierge.languageQuestion, locale),
    qcQuestion: localized(concierge.qcQuestion, locale),
    skQuestion: localized(concierge.skQuestion, locale),
    irbQuestion: localized(concierge.irbQuestion, locale),
    yes: localized(concierge.yes, locale),
    no: localized(concierge.no, locale),
    resultsTitle: localized(concierge.resultsTitle, locale),
    availabilityNote: localized(concierge.availabilityNote, locale),
    availabilityLoading: localized(concierge.availabilityLoading, locale),
    noAvailability: localized(concierge.noAvailability, locale),
    continueToBooking: localized(concierge.continueToBooking, locale),
    viewAll: localized(concierge.viewAll, locale),
    restart: localized(concierge.restart, locale),
    back: localized(concierge.back, locale),
    step: localized(concierge.step, locale),
    noExactMatch: localized(concierge.noExactMatch, locale),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteContent.brand.name,
    url: `${siteContent.brand.url}/${locale}`,
    availableLanguage: ["English", "French", "Spanish", "Portuguese"],
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replaceAll("<", "\\u003c") }}
      />

      <section className="home-hero">
        <div className="shell home-hero-grid">
          <div className="hero-copy">
            <h1>{localized(home.hero.title, locale)}</h1>
            <p>{localized(home.hero.body, locale)}</p>
            <div className="button-row">
              <Link className="button" href="#find-your-consultant">
                {localized(home.hero.primaryCta, locale)} <RouteArrow />
              </Link>
              <Link className="editorial-link" href="#team">
                {localized(home.hero.secondaryCta, locale)} <RouteArrow />
              </Link>
            </div>
          </div>
          <TeamMosaic consultants={consultants} locale={locale} />
        </div>
      </section>

      <section className="trust-strip" aria-label={trustLabel}>
        <div className="shell trust-grid">
          {home.trust.map((item) => (
            <div key={item.title.en}>
              <h2>{localized(item.title, locale)}</h2>
              <p>{localized(item.body, locale)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="concierge-section" id="find-your-consultant">
        <div className="shell concierge-section-grid">
          <div className="section-heading concierge-heading">
            <h2>{localized(home.concierge.title, locale)}</h2>
            <p>{localized(home.concierge.body, locale)}</p>
          </div>
          <Concierge locale={locale} consultants={consultants} copy={conciergeCopy} />
        </div>
      </section>

      <section className="team-section" id="team">
        <div className="shell">
          <div className="section-heading split-heading">
            <h2>{localized(home.team.title, locale)}</h2>
            <p>{localized(home.team.body, locale)}</p>
          </div>
          <div className="consultant-grid">
            {consultants.map((consultant) => (
              <ConsultantCard consultant={consultant} locale={locale} key={consultant.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="shell services-layout">
          <div className="section-heading sticky-heading">
            <h2>{localized(home.services.title, locale)}</h2>
            <p>{localized(home.services.body, locale)}</p>
            <Link className="editorial-link" href={localePath(locale, "/services")}>
              {localized(home.services.viewAll, locale)} <RouteArrow />
            </Link>
          </div>
          <div className="service-index">
            {services.map((service) => (
              <Link href={localePath(locale, `/services/${service.slug}`)} key={service.id}>
                <span className="service-dot" aria-hidden="true" />
                <span>
                  <strong>{localized(service.label, locale)}</strong>
                  <small>{localized(service.shortDescription, locale)}</small>
                </span>
                <RouteArrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="shell">
          <div className="section-heading process-heading">
            <h2>{localized(home.process.title, locale)}</h2>
          </div>
          <ol className="process-list">
            {home.process.steps.map((step, index) => (
              <li key={step.title.en}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{localized(step.title, locale)}</h3>
                <p>{localized(step.body, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="faq-section">
        <div className="shell faq-layout">
          <div className="section-heading sticky-heading">
            <h2>{localized(home.faqTitle, locale)}</h2>
          </div>
          <FaqList locale={locale} />
        </div>
      </section>

      <FinalCta locale={locale} />
    </main>
  );
}
