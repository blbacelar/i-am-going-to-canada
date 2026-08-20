import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Concierge, type ConciergeCopy } from "@/components/concierge/concierge";
import { PageIntro } from "@/components/marketing/page-intro";
import { getActiveConsultants, getActiveServices, siteContent } from "@/lib/content/data";
import { isLocale, localized } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localizedMetadata({
    locale,
    title: siteContent.concierge.title[locale],
    description: siteContent.concierge.intro[locale],
    path: "/find-a-consultant",
  });
}

export default async function FindConsultantPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy: ConciergeCopy = {
    intro: localized(siteContent.concierge.intro, locale),
    languageQuestion: localized(siteContent.concierge.languageQuestion, locale),
    serviceQuestion: localized(siteContent.concierge.serviceQuestion, locale),
    resultsTitle: localized(siteContent.concierge.resultsTitle, locale),
    viewProfile: localized(siteContent.concierge.viewProfile, locale),
    viewAll: localized(siteContent.concierge.viewAll, locale),
    restart: localized(siteContent.concierge.restart, locale),
    back: localized(siteContent.concierge.back, locale),
    step: localized(siteContent.concierge.step, locale),
    noExactMatch: localized(siteContent.concierge.noExactMatch, locale),
  };
  return (
    <main id="main-content">
      <PageIntro title={localized(siteContent.concierge.title, locale)} body={localized(siteContent.concierge.intro, locale)} />
      <section className="standalone-concierge">
        <div className="shell">
          <Concierge locale={locale} consultants={getActiveConsultants()} services={getActiveServices()} copy={copy} />
        </div>
      </section>
    </main>
  );
}
