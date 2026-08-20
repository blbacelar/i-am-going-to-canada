import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export function Brand({ locale }: { locale: Locale }) {
  const homeLabel = { en: "home", fr: "accueil", pt: "início" }[locale];
  return (
    <Link className="brand" href={`/${locale}`} aria-label={`I Am Going To Canada — ${homeLabel}`}>
      <span className="brand-logo" aria-hidden="true">
        <Image
          src="/brand/iamgoingtocanada-logo.png"
          alt=""
          width={2048}
          height={768}
          priority
          unoptimized
        />
      </span>
    </Link>
  );
}
