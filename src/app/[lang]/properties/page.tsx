import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGrid, PropertyGrid, SearchForm } from "@/components/property";
import { LanguageSwitch } from "@/components/site";
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
  const search = await searchParams;
  const filters = readFilters(search);
  const items = await listPublicProperties(filters);
  const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
  const hasFilters = Object.keys(query).length > 0;
  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const requestedPage = typeof search.page === "string" && /^\d+$/.test(search.page) ? Number(search.page) : 1;
  const page = Math.max(1, Math.min(requestedPage, pageCount));
  const visible = items.slice((page - 1) * pageSize, page * pageSize);
  const href = (targetPage: number) => ({ pathname: `/${lang}/properties`, query: { ...query, page: targetPage } });

  return (
    <main id="main">
      <section className="listing-hero">
        <div className="shell">
          <div className="utility"><p className="eyebrow"><span />{t.location}</p><LanguageSwitch lang={lang} path="/properties" query={{ ...query, ...(page > 1 && { page: String(page) }) }} /></div>
          <Link className="text-link" href={`/${lang}`}>← {t.home}</Link>
          <h1>{t.properties}</h1><p>{t.listingIntro}</p>
        </div>
      </section>
      <section className="shell search-panel" aria-label={t.submit}>
        <SearchForm lang={lang} filters={filters} />
      </section>
      <section className="shell section">
        <div className="section-head">
          <h2 className="results-title">{t.results} <span className="result-count">({items.length})</span></h2>
          {hasFilters && <Link className="text-link" href={`/${lang}/properties`}>{t.reset}</Link>}
        </div>
        {items.length > 0 ? <PropertyGrid lang={lang} items={visible} /> :
          <p className="empty-state">{hasFilters ? t.emptyFiltered : t.empty}</p>}
        {pageCount > 1 && (
          <nav className="utility" aria-label={lang === "zh" ? "房源分页" : "Property pages"}>
            {page > 1 && <Link className="text-link" href={href(page - 1)}>{lang === "zh" ? "上一页" : "Previous"}</Link>}
            <span aria-current="page">{page} / {pageCount}</span>
            {page < pageCount && <Link className="text-link" href={href(page + 1)}>{lang === "zh" ? "下一页" : "Next"}</Link>}
          </nav>
        )}
        <div className="listing-categories"><h2 className="results-title">{t.categoryTitle}</h2><CategoryGrid lang={lang} /></div>
      </section>
    </main>
  );
}
