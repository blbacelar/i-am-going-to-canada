import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/marketing/faq-list";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageIntro } from "@/components/marketing/page-intro";
import { siteContent } from "@/lib/content/data";
import { isLocale, localized } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({
    locale,
    title: siteContent.home.faqTitle[locale],
    description: siteContent.concierge.intro[locale],
    path: "/faq",
  });
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main id="main-content">
      <PageIntro title={localized(siteContent.home.faqTitle, locale)} body={localized(siteContent.concierge.intro, locale)} />
      <section className="directory-section">
        <div className="shell narrow-shell"><FaqList locale={locale} /></div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
