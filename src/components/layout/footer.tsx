import Link from "next/link";
import { Brand } from "@/components/ui/brand";
import { localized, localePath, type Locale } from "@/lib/i18n/config";
import { siteContent } from "@/lib/content/data";

export function Footer({ locale }: { locale: Locale }) {
  const { footer, navigation } = siteContent;
  const labels = {
    en: { navigation: "Footer navigation", legal: "Legal navigation" },
    fr: { navigation: "Navigation du pied de page", legal: "Navigation juridique" },
    pt: { navigation: "Navegação do rodapé", legal: "Navegação jurídica" },
  }[locale];
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
          <Brand locale={locale} />
          <p>{localized(footer.statement, locale)}</p>
        </div>
        <nav aria-label={labels.navigation} className="footer-links">
          <Link href={localePath(locale, "/blog")}>{localized(navigation.blog, locale)}</Link>
          <Link href={localePath(locale, "/consultants")}>{localized(navigation.consultants, locale)}</Link>
          <Link href={localePath(locale, "/services")}>{localized(navigation.services, locale)}</Link>
          <Link href={localePath(locale, "/about")}>{localized(navigation.about, locale)}</Link>
          <Link href={localePath(locale, "/faq")}>{localized(navigation.faq, locale)}</Link>
        </nav>
        <nav aria-label={labels.legal} className="footer-links">
          <Link href={localePath(locale, "/privacy")}>{localized(footer.privacy, locale)}</Link>
          <Link href={localePath(locale, "/disclaimer")}>{localized(footer.disclaimer, locale)}</Link>
        </nav>
      </div>
      <div className="footer-bottom shell">
        <p>© 2026 {siteContent.brand.name}</p>
        <p>{localized(footer.reviewNotice, locale)}</p>
      </div>
    </footer>
  );
}
