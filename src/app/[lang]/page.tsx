import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OwnerForm } from "@/components/owner-form";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { NextSixListings } from "@/components/nextsix-listings";
import { PropertyGrid, SearchForm } from "@/components/property";
import { PropertyTypeCards } from "@/components/property-type-cards";
import { areaGuides } from "@/lib/areas";
import { listPublicProperties } from "@/lib/properties";
import { copy, facebookUrl, isLocale, whatsappUrl } from "@/lib/site";

const cormorant = localFont({
  src: "../../fonts/cormorant-garamond-hero.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-cormorant",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

const notoSerif = localFont({
  src: "../../fonts/noto-serif-sc-hero.woff2",
  weight: "550 600",
  variable: "--font-noto-serif",
  preload: false,
  adjustFontFallback: false,
});

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];
  const base = `/${lang}`;
  const properties = await listPublicProperties();
  const featured = properties.filter((item) => item.featured).slice(0, 6);

  return (
    <main id="main" className="home-page">
      <section className="hero">
        <div className="shell hero-grid">
            <div className="hero-copy">
              <h1 className={`hero-heading ${lang === "zh" ? notoSerif.variable : cormorant.variable}`}>
                {t.heroFirst} <span className="hero-heading-accent">{t.heroSecond}</span>
              </h1>
              <svg className="hero-underline" viewBox="0 0 248 25" aria-hidden="true">
                <path fill="currentColor" d="M5 19C91-3 178-3 247 12 169 0 91 9 7 24 1 25-2 21 5 19Z" />
              </svg>
              <p>{lang === "zh" ? "柔佛房产买卖、出租及产业委托服务" : t.intro}</p>
              <div className="actions">
                <Link className="button gold-button hero-primary" href={`${base}/properties?deal=buy`}>{t.buyProperty}</Link>
                <Link className="button outline-button" href={`${base}/properties?deal=rent`}>{t.rentProperty}</Link>
                <a className="button outline-button hero-owner" href="#list">{t.list}</a>
              </div>
              <a className="text-link hero-contact" href={whatsappUrl}>{t.contact} ↗</a>
            </div>
            <figure className="portrait">
              <Image src="/iki-beige-blazer-original.png" alt={t.photoAlt} width={1266} height={1242} preload unoptimized />
            </figure>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 134" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="home-wave-gold"><stop stopColor="#ad8b55" /><stop offset=".35" stopColor="#ebd3a4" /><stop offset=".64" stopColor="#c9aa73" /><stop offset="1" stopColor="#e8c992" /></linearGradient></defs>
          <g className="hero-wave-desktop">
            <path fill="url(#home-wave-gold)" d="M0 7C207 24 365 114 627 102S958 103 1118 106 1320 101 1440 54V134H0Z" />
            <path fill="var(--ivory)" d="M0 57C206 28 398 125 650 113S946 118 1132 117 1350 101 1440 78V134H0Z" />
          </g>
          <g className="hero-wave-mobile">
            <path fill="url(#home-wave-gold)" d="M0 22C167 23 246 62 400 67H1010C1180 67 1310 59 1440 26V134H0Z" />
            <path fill="var(--ivory)" d="M0 43C163 38 250 77 400 77H1010C1180 77 1310 69 1440 45V134H0Z" />
          </g>
        </svg>
      </section>
      <section className="shell search-panel" aria-labelledby="search-heading">
        <div className="section-head search-head"><h2 id="search-heading">{t.submit}</h2></div>
        <SearchForm lang={lang} home />
        <NextSixListings lang={lang} hasLocalListings={properties.length > 0} />
      </section>
      <section className="shell section category-section">
        <h2>{t.categoryTitle}</h2><PropertyTypeCards lang={lang} />
      </section>
      {featured.length > 0 && <section className="type-section section home-featured">
        <div className="shell">
          <div className="section-head"><h2>{t.featured}</h2><Link className="text-link" href={`${base}/properties`}>{t.viewAll} ↗</Link></div>
          <PropertyGrid lang={lang} items={featured} />
        </div>
      </section>}
      <MortgageCalculator lang={lang} />
      <section id="about" className="shell section split-section">
        <p className="eyebrow"><span />{t.about}</p>
        <div><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><p>{t.aboutAreas}</p></div>
      </section>
      <section id="area-guides" className="section type-section">
        <div className="shell">
          <p className="eyebrow"><span />{t.guides}</p>
          <div className="section-head"><div><h2>{t.guidesTitle}</h2><p>{t.guidesIntro}</p></div>
            <Link className="text-link" href={`${base}/area-guides`}>{t.allGuides} ↗</Link>
          </div>
          <ul className="area-links">{areaGuides.map((area) => (
            <li key={area.slug}><Link href={`${base}/area-guides#${area.slug}`}>{area.name[lang]} <span aria-hidden="true">↗</span></Link></li>
          ))}</ul>
        </div>
      </section>
      <section id="list" className="owner section">
        <div className="shell owner-row">
          <div><p className="eyebrow"><span />{t.list}</p><h2>{t.ownerTitle}</h2><p>{t.ownerText}</p></div>
          <OwnerForm lang={lang} />
        </div>
      </section>
      <section id="contact" className="shell section split-section">
        <p className="eyebrow"><span />{t.contactNav}</p>
        <div><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div className="actions">
          <a className="button" href={whatsappUrl}>{t.contact} ↗</a>
          <a className="text-link" href={facebookUrl} target="_blank" rel="noreferrer">{t.facebook} ↗</a>
        </div></div>
      </section>
      <p className="shell skyline-credit"><a href="https://commons.wikimedia.org/wiki/File:Johor_Bahru_skyline_at_night.jpg">Johor Bahru at night · Lionel Lim</a> · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a> · {lang === "zh" ? "裁切与色调调整" : "Cropped and color toned"}</p>
    </main>
  );
}


