import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGrid, PropertyGrid, SearchForm } from "@/components/property";
import { LanguageSwitch } from "@/components/site";
import { NextSixListings } from "@/components/nextsix-listings";
import { listPublicProperties, readFilters } from "@/lib/properties";
import { copy, isLocale } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/properties">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: copy[lang].properties, description: copy[lang].listingIntro } : { title: "Properties" };
}

export default async function Properties({ params, searchParams }: PageProps<"/[lang]/properties">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];
  const filters = readFilters(await searchParams);
  const items = await listPublicProperties(filters);
  const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
  const hasFilters = Object.keys(query).length > 0;

  return (
    <main id="main">
      <section className="listing-hero">
        <div className="shell">
          <div className="utility"><p className="eyebrow"><span />{t.location}</p><LanguageSwitch lang={lang} path="/properties" query={query} /></div>
          <Link className="text-link" href={`/${lang}`}>← {t.home}</Link>
          <h1>{t.properties}</h1><p>{t.listingIntro}</p>
        </div>
      </section>
      <section className="shell search-panel" aria-label={t.submit}>
        <SearchForm lang={lang} filters={filters} />
        <NextSixListings lang={lang} hasLocalListings={(await listPublicProperties()).length > 0} />
      </section>
      <section className="shell section">
        <div className="section-head">
          <h2 className="results-title">{t.results} <span className="result-count">({items.length})</span></h2>
          {hasFilters && <Link className="text-link" href={`/${lang}/properties`}>{t.reset}</Link>}
        </div>
        {items.length > 0 ? <PropertyGrid lang={lang} items={items} /> :
          <p className="empty-state">{hasFilters ? t.emptyFiltered : t.empty}</p>}
        <div className="listing-categories"><h2 className="results-title">{t.categoryTitle}</h2><CategoryGrid lang={lang} /></div>
      </section>
    </main>
  );
}
