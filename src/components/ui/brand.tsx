import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/lib/content/data";
import type { Locale } from "@/lib/i18n/config";

export function Brand({ locale }: { locale: Locale }) {
  const homeLabel = { en: "home", fr: "accueil", pt: "início" }[locale];
  return (
    <Link className="brand" href={`/${locale}`} aria-label={`${siteContent.brand.name}, ${homeLabel}`}>
      <span className="brand-logo">
        <span className="brand-mark" aria-hidden="true">
          <Image
            src="/brand/marina-ms-logo.png"
            alt=""
            width={588}
            height={488}
            priority
            unoptimized
          />
        </span>
        <span className="brand-copy" aria-hidden="true">
          <span className="brand-name">I Am Going To Canada</span>
          <span className="brand-signature">by Marina Snyder</span>
        </span>
      </span>
    </Link>
  );
}
