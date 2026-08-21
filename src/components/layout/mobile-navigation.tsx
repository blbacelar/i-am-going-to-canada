"use client";

import Link from "next/link";
import { useRef } from "react";

type MobileNavigationLink = {
  href: string;
  label: string;
};

export function MobileNavigation({
  menuLabel,
  links,
  findHref,
  findLabel,
}: {
  menuLabel: string;
  links: MobileNavigationLink[];
  findHref: string;
  findLabel: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <details className="mobile-navigation" ref={detailsRef}>
      <summary>{menuLabel}</summary>
      <div className="mobile-navigation-panel">
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={closeMenu}>{link.label}</Link>
        ))}
        <Link href={findHref} onClick={closeMenu}>{findLabel}</Link>
      </div>
    </details>
  );
}
