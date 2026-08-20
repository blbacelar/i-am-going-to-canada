import Link from "next/link";
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
      </div>
    </section>
  );
}
