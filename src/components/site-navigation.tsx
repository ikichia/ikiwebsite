"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { copy, type Locale } from "@/lib/site";

export function SiteNavigation({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const navId = useId();
  const t = copy[lang];
  const base = `/${lang}`;
  const pathname = usePathname();
  const links = [
    [base, t.home],
    [`${base}/properties`, t.properties],
    [`${base}/area-guides`, t.guides],
    [`${base}#about`, t.about],
    [`${base}#contact`, t.contactNav],
  ];

  return (
    <>
      <button
        className="mobile-nav-toggle"
        type="button"
        ref={menu}
        aria-controls={navId}
        aria-expanded={open}
        aria-label={lang === "zh" ? "导航" : "Navigation menu"}
        onClick={() => setOpen(!open)}
      >
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={open ? "M5 5l14 14M19 5 5 19" : "M3 6h18M3 12h18M3 18h18"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <nav className="navlinks" id={navId} aria-label={lang === "zh" ? "主导航" : "Main navigation"}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            menu.current?.focus();
          }
        }}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
            onClick={() => setOpen(false)}>{label}</Link>
        ))}
      </nav>
    </>
  );
}
