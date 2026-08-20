import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import "../globals.css";

const primaryFont = Schibsted_Grotesk({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const monoFont = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iamgoingtocanada.ca"),
  title: {
    default: "I Am Going To Canada",
    template: "%s | I Am Going To Canada",
  },
  description:
    "Meet a multilingual Canadian immigration consultant team and find the professional conversation that fits your needs.",
  applicationName: "I Am Going To Canada",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "I Am Going To Canada",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f7f9",
  colorScheme: "light",
};

const directionContract = `<!--
THESIS: Professional choice becomes clear through calm comparison; it refuses decorative travel imagery and personality-first hierarchy.
OWN-WORLD: Cool slate grounds, white surfaces, one navy accent, Schibsted Grotesk hierarchy and Space Mono evidence labels.
STORY: Understand the team, compare public attributes, choose broad support and continue to a direct professional conversation.
FIRST VIEWPORT: A compact sans-serif promise and primary action balance four equally scaled portraits on a cool neutral field.
FORM: Owner-pinned design reference, applied as the site-wide visual system; seed f33503b8.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

const skipLinks: Record<Locale, string> = {
  en: "Skip to content",
  fr: "Passer au contenu",
  pt: "Pular para o conteúdo",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${primaryFont.variable} ${monoFont.variable}`} data-scroll-behavior="smooth">
      <body>
        <div aria-hidden="true" className="design-contract" dangerouslySetInnerHTML={{ __html: directionContract }} />
        <div className="site-frame">
          <a className="skip-link" href="#main-content">{skipLinks[locale]}</a>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
