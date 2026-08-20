"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Consultant } from "@/lib/schemas/content";
import { localized, localePath, type Locale } from "@/lib/i18n/config";

export function TeamMosaic({
  consultants,
  locale,
}: {
  consultants: Consultant[];
  locale: Locale;
}) {
  const mosaicRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mosaic = mosaicRef.current;
    if (!mosaic) return;

    let isVisible = false;
    const updateMotion = () => {
      mosaic.dataset.motion = isVisible && !document.hidden ? "active" : "paused";
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        updateMotion();
      },
      { threshold: 0.1 },
    );

    observer.observe(mosaic);
    document.addEventListener("visibilitychange", updateMotion);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, []);

  return (
    <figure className="team-mosaic" data-motion="paused" ref={mosaicRef}>
      <div className="team-route" aria-hidden="true">
        <svg viewBox="0 0 520 510" preserveAspectRatio="none">
          <path d="M34 376C108 225 164 297 235 205S371 62 486 142" />
          <circle cx="34" cy="376" r="6" />
          <circle cx="486" cy="142" r="6" />
        </svg>
      </div>
      <div className="team-mosaic-grid">
        {consultants.map((consultant) => (
          <Link href={localePath(locale, `/consultants/${consultant.slug}`)} key={consultant.id}>
            <Image
              src={consultant.portrait.src}
              alt={localized(consultant.portrait.alt, locale)}
              fill
              priority
              unoptimized
              sizes="(max-width: 700px) 45vw, 19vw"
            />
            <span>{consultant.name}</span>
          </Link>
        ))}
      </div>
    </figure>
  );
}
