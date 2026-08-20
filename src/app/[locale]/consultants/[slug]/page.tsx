import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultantCard } from "@/components/consultants/consultant-card";
import { CredentialBadge } from "@/components/consultants/credential-badge";
import { ProfileViewTracker } from "@/components/consultants/profile-view-tracker";
import { TrackedExternalLink } from "@/components/ui/tracked-link";
import { RouteArrow } from "@/components/ui/route-arrow";
import { getActiveConsultants, getConsultantBySlug, getServiceById, siteContent } from "@/lib/content/data";
import { isLocale, languageNames, localized, localePath } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getActiveConsultants().map((consultant) => ({ slug: consultant.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const consultant = getConsultantBySlug(slug);
  if (!consultant) return {};
  return localizedMetadata({
    locale,
    title: consultant.seo.title[locale],
    description: consultant.seo.description[locale],
    path: `/consultants/${slug}`,
  });
}

export default async function ConsultantProfilePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const consultant = getConsultantBySlug(slug);
  if (!consultant) notFound();

  const common = siteContent.common;
  const services = consultant.serviceIds.flatMap((id) => {
    const service = getServiceById(id);
    return service ? [service] : [];
  });
  const related = getActiveConsultants().filter((item) => item.id !== consultant.id).slice(0, 3);
  const [primaryCredential, ...additionalCredentials] = consultant.credentials;
  const bookLabel = localized(common.book, locale).replace("{name}", consultant.name.replace(" — TODO_CONTENT", ""));
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: consultant.name.replace(" — TODO_CONTENT", ""),
    jobTitle: localized(consultant.role, locale),
    url: `${siteContent.brand.url}${localePath(locale, `/consultants/${consultant.slug}`)}`,
    knowsLanguage: consultant.languages.map((language) => languageNames.en[language]),
  };

  return (
    <main id="main-content">
      <ProfileViewTracker locale={locale} consultantId={consultant.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replaceAll("<", "\\u003c") }} />
      <section className="profile-hero">
        <div className="shell profile-grid">
          <div className="profile-image">
            <Image src={consultant.portrait.src} alt={localized(consultant.portrait.alt, locale)} width={800} height={1000} priority />
            {primaryCredential ? <CredentialBadge label={primaryCredential.label} value={primaryCredential.value} /> : null}
          </div>
          <div className="profile-copy">
            <Link className="back-link" href={localePath(locale, "/consultants")}>← {localized(common.backToTeam, locale)}</Link>
            {consultant.verificationStatus === "todo-content" ? (
              <p className="content-status content-status-todo">{localized(common.contentReview, locale)}</p>
            ) : null}
            <h1>{consultant.name}</h1>
            <p className="profile-role">{localized(consultant.role, locale)}</p>
            <p className="profile-bio">{localized(consultant.fullBio, locale)}</p>
            <div className="profile-meta-grid">
              <div>
                <h2>{localized(common.publishedLanguages, locale)}</h2>
                <p>{consultant.languages.length ? consultant.languages.map((language) => languageNames[locale][language]).join(" · ") : localized(common.informationComingSoon, locale)}</p>
              </div>
              <div>
                <h2>{localized(common.publishedServices, locale)}</h2>
                <p>{services.length ? services.map((service) => localized(service.label, locale)).join(" · ") : localized(common.informationComingSoon, locale)}</p>
              </div>
            </div>
            {additionalCredentials.length ? (
              <div className="credential-list">
                {additionalCredentials.map((credential) => (
                  <span key={`${credential.label}-${credential.value}`}>{credential.label} · {credential.value}</span>
                ))}
              </div>
            ) : null}
            {consultant.calendlyUrl === "TODO_CONTENT" ? (
              <p className="booking-unavailable">{localized(common.bookingUnavailable, locale)}</p>
            ) : (
              <TrackedExternalLink className="button profile-booking" href={consultant.calendlyUrl} event={{ event: "booking_clicked", locale, consultantId: consultant.id }}>
                {bookLabel} <RouteArrow />
              </TrackedExternalLink>
            )}
          </div>
        </div>
      </section>
      <section className="related-team">
        <div className="shell">
          <h2>{localized(siteContent.navigation.consultants, locale)}</h2>
          <div className="consultant-grid consultant-grid-related">
            {related.map((item) => <ConsultantCard key={item.id} consultant={item} locale={locale} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
