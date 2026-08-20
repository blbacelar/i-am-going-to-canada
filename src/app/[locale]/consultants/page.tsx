import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConsultantCard } from "@/components/consultants/consultant-card";
import { FinalCta } from "@/components/marketing/final-cta";
import { PageIntro } from "@/components/marketing/page-intro";
import { getActiveConsultants, siteContent } from "@/lib/content/data";
import { isLocale, localized } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteContent.pages.consultants;
  return localizedMetadata({ locale, title: copy.title[locale], description: copy.body[locale], path: "/consultants" });
}

export default async function ConsultantsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteContent.pages.consultants;
  return (
    <main id="main-content">
      <PageIntro title={localized(copy.title, locale)} body={localized(copy.body, locale)} />
      <section className="directory-section">
        <div className="shell consultant-grid">
          {getActiveConsultants().map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} locale={locale} />
          ))}
        </div>
      </section>
      <FinalCta locale={locale} />
    </main>
  );
}
