import Link from "next/link";
import { EmergencyContact } from "@/components/marketing/emergency-contact";
import { RouteArrow } from "@/components/ui/route-arrow";
import { localized, localePath, type Locale } from "@/lib/i18n/config";
import { siteContent } from "@/lib/content/data";

export function FinalCta({ locale }: { locale: Locale }) {
  const copy = siteContent.home.final;
  return (
    <section className="final-cta">
      <div className="shell final-cta-inner">
        <h2>{localized(copy.title, locale)}</h2>
        <p>{localized(copy.body, locale)}</p>
        <div className="button-row">
          <Link className="button button-maple" href={localePath(locale, "/find-a-consultant")}>
            {localized(siteContent.navigation.find, locale)} <RouteArrow />
          </Link>
          <Link className="editorial-link editorial-link-light" href={localePath(locale, "/consultants")}>
            {localized(siteContent.navigation.consultants, locale)} <RouteArrow />
          </Link>
        </div>
        <EmergencyContact
          copy={{
            title: localized(copy.emergency.title, locale),
            body: localized(copy.emergency.body, locale),
            nameLabel: localized(copy.emergency.nameLabel, locale),
            emailLabel: localized(copy.emergency.emailLabel, locale),
            messageLabel: localized(copy.emergency.messageLabel, locale),
            messageHint: localized(copy.emergency.messageHint, locale),
            submit: localized(copy.emergency.submit, locale),
            sending: localized(copy.emergency.sending, locale),
            success: localized(copy.emergency.success, locale),
            error: localized(copy.emergency.error, locale),
          }}
        />
      </div>
    </section>
  );
}
