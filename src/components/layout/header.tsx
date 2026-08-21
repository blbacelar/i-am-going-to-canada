import Link from "next/link";
import { Brand } from "@/components/ui/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { localized, localePath, type Locale } from "@/lib/i18n/config";
import { getArticleRouteMap, siteContent } from "@/lib/content/data";

export function Header({ locale }: { locale: Locale }) {
  const nav = siteContent.navigation;
  const primaryLabel = { en: "Primary navigation", fr: "Navigation principale", pt: "Navegação principal" }[locale];
  const links = [
    { href: localePath(locale, "/consultants"), label: localized(nav.consultants, locale) },
    { href: localePath(locale, "/services"), label: localized(nav.services, locale) },
    { href: localePath(locale, "/about"), label: localized(nav.about, locale) },
    { href: localePath(locale, "/faq"), label: localized(nav.faq, locale) },
    { href: localePath(locale, "/blog"), label: localized(nav.blog, locale) },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand locale={locale} />
        <nav className="desktop-nav" aria-label={primaryLabel}>
          {links.map((link) => (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher locale={locale} label={localized(nav.language, locale)} articleRoutes={getArticleRouteMap()} />
          <Link className="button button-small" href={localePath(locale, "/find-a-consultant")}>
            {localized(nav.find, locale)}
          </Link>
        </div>
        <MobileNavigation
          menuLabel={localized(nav.menu, locale)}
          links={links}
          findHref={localePath(locale, "/find-a-consultant")}
          findLabel={localized(nav.find, locale)}
        />
      </div>
    </header>
  );
}
