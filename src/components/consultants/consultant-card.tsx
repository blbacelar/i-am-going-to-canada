import Image from "next/image";
import Link from "next/link";
import { CredentialBadge } from "@/components/consultants/credential-badge";
import { TrackedExternalLink } from "@/components/ui/tracked-link";
import { RouteArrow } from "@/components/ui/route-arrow";
import { getServiceById, siteContent } from "@/lib/content/data";
import { languageNames, localized, localePath, practiceAreaNames, type Locale } from "@/lib/i18n/config";
import type { Consultant } from "@/lib/schemas/content";

export function ConsultantCard({ consultant, locale }: { consultant: Consultant; locale: Locale }) {
  const isTodo = consultant.verificationStatus === "todo-content";
  const primaryCredential = consultant.credentials[0];
  const common = siteContent.common;
  const bookLabel = localized(common.book, locale).replace("{name}", consultant.name.replace(" — TODO_CONTENT", ""));

  return (
    <article className="consultant-card">
      <Link className="consultant-portrait" href={localePath(locale, `/consultants/${consultant.slug}`)}>
        <Image
          src={consultant.portrait.src}
          alt={localized(consultant.portrait.alt, locale)}
          width={800}
          height={1000}
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 300px"
        />
        {primaryCredential ? <CredentialBadge label={primaryCredential.label} value={primaryCredential.value} /> : null}
      </Link>
      <div className="consultant-card-copy">
        {isTodo ? (
          <p className="content-status content-status-todo">{localized(common.contentReview, locale)}</p>
        ) : null}
        <h3>{consultant.name}</h3>
        <p className="consultant-role">{localized(consultant.role, locale)}</p>
        <p>{localized(consultant.shortBio, locale)}</p>
        <dl className="consultant-meta">
          <div>
            <dt>{localized(common.publishedLanguages, locale)}</dt>
            <dd>{consultant.languages.length ? consultant.languages.map((language) => languageNames[locale][language]).join(" · ") : localized(common.informationComingSoon, locale)}</dd>
          </div>
          <div>
            <dt>{localized(common.publishedServices, locale)}</dt>
            <dd>
              {consultant.serviceIds.length
                ? consultant.serviceIds.map((serviceId) => {
                    const service = getServiceById(serviceId);
                    return service ? localized(service.label, locale) : serviceId;
                  }).join(" · ")
                : localized(common.informationComingSoon, locale)}
            </dd>
          </div>
          {consultant.practiceAreas.length ? (
            <div>
              <dt>{locale === "en" ? "Areas" : locale === "fr" ? "Domaines" : "Áreas"}</dt>
              <dd>{consultant.practiceAreas.map((area) => practiceAreaNames[locale][area]).join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
        <div className="consultant-actions">
          <Link className="editorial-link" href={localePath(locale, `/consultants/${consultant.slug}`)}>
            {localized(common.viewProfile, locale)} <RouteArrow />
          </Link>
          {consultant.calendlyUrl === "TODO_CONTENT" ? (
            <span className="booking-unavailable" aria-disabled="true">{localized(common.bookingUnavailable, locale)}</span>
          ) : (
            <TrackedExternalLink
              className="booking-link"
              href={consultant.calendlyUrl}
              event={{ event: "booking_clicked", locale, consultantId: consultant.id }}
            >
              {bookLabel}
            </TrackedExternalLink>
          )}
        </div>
      </div>
    </article>
  );
}
