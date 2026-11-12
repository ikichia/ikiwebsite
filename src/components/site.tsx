import Link from "next/link";
import { copy, facebookUrl, whatsappUrl, type Locale } from "@/lib/site";
import { SiteNavigation } from "./site-navigation";

export function Header({ lang }: { lang: Locale }) {
  const t = copy[lang];
  const base = `/${lang}`;
  return (
    <header className="masthead">
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="shell topbar">
        <Link className="wordmark" href={base}>Property <span>with</span> Iki<span className="brand-dot">.</span></Link>
        <Link className="editorial-brand" href={base}>
          <svg width="53" height="49" viewBox="0 0 58 54" aria-hidden="true">
            <path d="M8 40V19L28 4l20 15v15" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M0 53C17 40 38 33 57 38 34 39 16 45 0 53Z" fill="currentColor" />
            <path d="M22 23h5v5h-5zm7 0h5v5h-5zm-7 7h5v5h-5zm7 0h5v5h-5z" fill="currentColor" />
          </svg>
          <span><strong>property with <i>iki</i></strong><small>JOHOR · MALAYSIA</small></span>
        </Link>
        <SiteNavigation lang={lang} />
        <div className="editorial-header-actions">
          <LanguageSwitch lang={lang} compact />
          <a className="button gold-button editorial-header-contact" href={whatsappUrl}>WhatsApp</a>
        </div>
      </div>
    </header>
  );
}

export function LanguageSwitch({ lang, path = "", query, compact = false }: {
  lang: Locale;
  path?: string;
  query?: Record<string, string>;
  compact?: boolean;
}) {
  return (
    <nav className="language" aria-label={lang === "zh" ? "网站语言" : "Site language"}>
      {(["en", "zh"] as const).map((value) => (
        <Link key={value} href={{ pathname: `/${value}${path}`, query }}
          aria-current={lang === value ? "page" : undefined}
          hrefLang={value} lang={value === "zh" ? "zh-Hans" : "en"}>
          {value === "en" ? (compact ? "EN" : "English") : "中文"}
        </Link>
      ))}
    </nav>
  );
}

export function Footer({ lang }: { lang: Locale }) {
  const t = copy[lang];
  return (
    <footer className="footer">
      <div className="shell footer-row">
        <div><Link className="wordmark" href={`/${lang}`}>Property <span>with</span> Iki<span className="brand-dot">.</span></Link><p>{t.location}</p></div>
        <div className="footer-links">
          <a href={whatsappUrl}>{t.contact}</a>
          <a href={facebookUrl} target="_blank" rel="noreferrer">{t.facebook} ↗</a>
        </div>
      </div>
    </footer>
  );
}

export function MobileContact({ lang }: { lang: Locale }) {
  return (
    <div className="mobile-contact-dock">
      <a className="mobile-contact button" href={whatsappUrl}>{copy[lang].contact}</a>
    </div>
  );
}
