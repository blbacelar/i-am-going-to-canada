import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/marketing/page-intro";
import { siteContent } from "@/lib/content/data";
import { isLocale, localized } from "@/lib/i18n/config";
import { localizedMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteContent.pages.disclaimer;
  return localizedMetadata({ locale, title: copy.title[locale], description: copy.body[locale], path: "/disclaimer" });
}

export default async function DisclaimerPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteContent.pages.disclaimer;
  return (
    <main id="main-content">
      <PageIntro title={localized(copy.title, locale)} body={localized(copy.body, locale)} />
      <section className="legal-page"><div className="shell narrow-shell"><p>{localized(copy.body, locale)}</p></div></section>
    </main>
  );
}
